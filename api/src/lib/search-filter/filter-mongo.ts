import { escapeRegExp, isEmpty, isNumber, toNumber } from 'lodash';
import * as ms from 'ms';

import {
    DEFAULT_FIELD_NAME, DEFAULT_LIMIT, FilterExpression, FilterParams, parseFilterDsl
} from './filter';
import {
    InvalidBooleanFilter, InvalidDateFilter, InvalidMetadataFilter, InvalidNumberFilter,
    InvalidStringFilter
} from './filter-error';
import {
 FilterParser, FilterParserOptions, ParsingError, ParsingErrorDetail
} from './filter-parser';
import { formatFieldErrorMessage, isNegative } from './filter-utils';

// export for convenience
export { FilterExpression, FilterParams } from './filter';

// Mongo filter parser
// This class implementation can be used as a reference to construct future parsers
export class MongoFilterParser extends FilterParser {
    constructor(protected readonly options: FilterParserOptions) {
        super({
            string: stringFieldParser,
            number: numberFieldParser,
            metadata: metadataFieldParser,
            boolean: booleanFieldParser,
            date: dateFieldParser
        }, options);
    }

    public parse({ filter, fields, limit, sort, page }: FilterParams = {}, context?: object): { value?: {query: {}, options: {
        limit?: number, sort?: {[key: string]: -1 | 1}, skip?: number, fields?: {[key: string]: -1 | 1}
    }}, error?: ParsingError } {
        const parseFilter = parseFilterDsl(filter || '');
        if (parseFilter.error) {
            return {error: {
                title: 'Invalid query argument(s)',
                metadata: transformToMetadata([parseFilter.error])
            }};
        }
        const errors = new Array<ParsingErrorDetail | undefined>();
        const queryExpressions = new Array<object>();
        for (const expr of parseFilter.filterExpressions || []) {
            try {
                const result = this.executeExpressionParser(expr, context);
                queryExpressions.push(result);
            } catch (error) {
                throw error;
            }
        }

        // We only use $and in join expressions, more complicated scenarios are not necessary and could make the filtering system more vulnerable
        const query = queryExpressions.length > 0 ? { $and: queryExpressions } : {};

        // Now we are ready to parse other options
        const limitValidation = this.validateLimit(limit);
        const pageValidation = this.validatePage(page);
        const sortValidation = this.validateMongoSort(sort);
        const fieldValidation = this.validateMongoFields(fields);

        errors.push(
            limitValidation.error,
            pageValidation.error,
            sortValidation.error,
            fieldValidation.error
        );
        if (errors.some((error) => error !== undefined)) {
            return { error: {
                title: 'Invalid query argument(s)',
                metadata: transformToMetadata(errors)
            }};
        }

        const options: {limit?: number, skip?: number, sort?: {[key: string]: 1 | -1}, fields?: {[key: string]: 1 | -1}} = {
            limit: limitValidation.value,
            skip: ((pageValidation.value || 1) - 1) * (limitValidation.value || DEFAULT_LIMIT),
            sort: sortValidation.value
        };

        if (fields) {
            options.fields = fieldValidation.value;
        }
        return {value: {query, options}};
    }

    private validateMongoSort(sort?: string): {
        value?: {[key: string]: 1 | -1};
        error?: ParsingErrorDetail | undefined;
    } {
        const validSort = this.validateSort(sort);
        if (validSort.error) {
            return {
                error: validSort.error
            };
        }
        const value = validSort.value?.split(',').reduce((acc, key) => {
            const negate = key.startsWith('-');
            if (negate) {
                acc[key.substr(1)] = -1;
                return acc;
            }
            acc[key] = 1;
            return acc;
        }, {});
        return { value };
    }

    private validateMongoFields(fields?: string): {
        value?: {[key: string]: 1 | -1};
        error?: ParsingErrorDetail | undefined;
    } {
        if (!fields) {
            return {};
        }
        const validFields = this.validateFields(fields);
        if (validFields.error) {
            return {
                error: validFields.error
            };
        }
        const value = validFields.value?.split(',').reduce((acc, key) => {
            const negate = key.startsWith('-');
            if (negate) {
                acc[key.substr(1)] = -1;
                return acc;
            }
            acc[key] = 1;
            return acc;
        }, {});
        return { value };
    }
}

function transformToMetadata(errors: Array<ParsingErrorDetail | undefined>): {[key: string]: string} {
    return errors.filter((error) => error !== undefined).reduce((acc, {code, message}: ParsingErrorDetail) => {
        acc[code] = message;
        return acc;
      }, {});
}

export function elemMatch(key: string, obj: object): { [key: string]: { $elemMatch: {} } } {
    return { [key]: { $elemMatch: obj } };
}

export function metadataFieldParser(filter: FilterExpression): { [key: string]: {} } {
    if (!filter.fieldParts[1]) {
        throw new InvalidMetadataFilter(formatFieldErrorMessage('Filter not allowed', filter.field));
    }

    const negate = isNegative(filter.prefix);
    switch (filter.op) {
        case 'eq':
            const matchRegex = new RegExp(`^${escapeRegExp(filter.term)}$`, 'i');
            if (negate) {
                return elemMatch(filter.fieldParts[0], { key: filter.fieldParts[1], value: { $not: matchRegex } });
            }
            return elemMatch(filter.fieldParts[0], { key: filter.fieldParts[1], value: { $regex: matchRegex } });
        case 'in':
            return elemMatch(filter.fieldParts[0], { key: filter.fieldParts[1], value: { [negate ? '$nin' : '$in']: filter.terms } });
        case 'all':
            return elemMatch(filter.fieldParts[0], { key: filter.fieldParts[1], value: conditionalNegation({ $all: filter.terms }, negate) });
        case 'txt':
            if (negate) {
                throw new InvalidMetadataFilter(formatFieldErrorMessage('Txt search negation is not supported at this time', filter.field));
            }
            const reg = new RegExp(escapeRegExp(filter.term), 'i');
            return elemMatch(filter.fieldParts[0], { key: filter.fieldParts[1], value: { $regex: reg } });
        default:
            throw new InvalidMetadataFilter(formatFieldErrorMessage(`Unknown filter operation: ${filter.op}`, filter.field));
    }
}

export function existField(field: string, prefix?: string): object {
    if (!field.startsWith('metadata.')) {
        return {[field]: {[prefix === '-' ? '$in' : '$nin']: ['', [], null]}};
    }
    const key = field.split('metadata.').pop();
    if (prefix === '-') {
        return {metadata: {$not: {$elemMatch: {key}}}};
    }
    return {metadata: {$elemMatch: {key}}};
}

export function stringFieldParser(filter: FilterExpression): {[key: string]: {}} {
    const negate = isNegative(filter.prefix);
    switch (filter.op) {
        case 'eq':
            return {[filter.field]: { [negate ? '$ne' : '$eq']: filter.term }};
        case 'in':
            return {[filter.field]: { [negate ? '$nin' : '$in']: filter.terms }};
        case 'all':
            return {[filter.field]: conditionalNegation({ $all: filter.terms }, negate)};
        case 'txt':
            if (negate) {
                throw new InvalidStringFilter(formatFieldErrorMessage('Txt search negation is not supported at this time', filter.field));
            }
            const reg = new RegExp(escapeRegExp(filter.term), 'i');
            return {[filter.field]: { $regex: reg }};
        default:
            throw new InvalidStringFilter(formatFieldErrorMessage(`Unknown filter operation: ${filter.op}`, filter.field));
    }
}

function parseNumber(numberAsString?: string, field?: string): number {
    if (isEmpty(numberAsString)) {
        throw new InvalidNumberFilter(formatFieldErrorMessage('Empty or null value cannot be converted to a number', field));
    }

    const value = toNumber(numberAsString);
    if (!isNumber(value) || isNaN(value)) {
        throw new InvalidNumberFilter(formatFieldErrorMessage('Invalid filter value for number', field));
    }
    return value;
}

function assertNotDefaultField(field: string): void {
    if (field === DEFAULT_FIELD_NAME) {
        throw new InvalidNumberFilter('Default filter does not exist for this type.');
    }
}

export function numberFieldParser(filter: FilterExpression): {[key: string]: {}} {
    // Not possible for number values
    assertNotDefaultField(filter.field);

    const negate = isNegative(filter.prefix);
    switch (filter.op) {
        case 'eq':
            return {[filter.field]: { [negate ? '$ne' : '$eq']: parseNumber(filter.term, filter.field)}};
        case 'in':
            return {[filter.field]: { [negate ? '$nin' : '$in']: filter.terms.map((term) => parseNumber(term))}};
        case 'all':
            return {[filter.field]: conditionalNegation({ $all: filter.terms.map((term) => parseNumber(term))}, negate)};
        case 'gt':
            return {[filter.field]: conditionalNegation({ $gt: parseNumber(filter.term, filter.field) }, negate)};
        case 'lt':
            return {[filter.field]: conditionalNegation({ $lt: parseNumber(filter.term, filter.field) }, negate)};
        case 'gte':
            return {[filter.field]: conditionalNegation({ $gte: parseNumber(filter.term, filter.field) }, negate)};
        case 'lte':
            return {[filter.field]: conditionalNegation({ $lte: parseNumber(filter.term, filter.field) }, negate)};
        case 'rng':
            return {[filter.field]: conditionalNegation({ $gte: parseNumber(filter.minTerm, filter.field), $lte: parseNumber(filter.maxTerm, filter.field) }, negate)};
        default:
            throw new InvalidNumberFilter(formatFieldErrorMessage(`Unknown filter operation: ${filter.op}`, filter.field));
    }
}

function isDate(date: Date): boolean {
    // An invalid date object returns NaN for getTime() and NaN is the only
    // object not strictly equal to itself.
    return date.getTime() === date.getTime();
}

function assertMs(values: string[], field): void {
    const failed = values.find((value) => !ms(value));
    if (!failed) {
        return ;
    }
    throw new InvalidDateFilter(formatFieldErrorMessage(`Invalid filter value "${failed}" for date ${field}`));
}

function parseDate(dateAsString?: string, field?: string): Date {
    if (!dateAsString) {
        throw new InvalidDateFilter(formatFieldErrorMessage('Empty or null value cannot be converted to a date', field));
    }

    const value = new Date(dateAsString);

    if (isDate(value)) {
        return value;
    }

    const match = dateAsString.match(/[0-9]+(?: *[a-zA-Z]+)/g);
    if (match) {
        assertMs(match, field);
        const milliseconds = match.map((it) => ms(it)).reduce((acc, count) => acc + count, 0);
        const time = new Date().getTime();
        return new Date(time - milliseconds);
    }

    throw new InvalidDateFilter(formatFieldErrorMessage('Invalid filter value for date', field));
}

export function conditionalNegation(value: object, negate: boolean): object {
    return negate ? { $not: value } : value;
}

export function dateFieldParser(filter: FilterExpression): {[key: string]: {}} {
    // Not possible for date field values
    assertNotDefaultField(filter.field);

    const negate = isNegative(filter.prefix);
    switch (filter.op) {
        case 'eq':
            return {[filter.field]: { [negate ? '$ne' : '$eq']: parseDate(filter.term, filter.field)}};
        case 'in':
            return {[filter.field]: { [negate ? '$nin' : '$in']: filter.terms.map((term) => parseDate(term))}};
        case 'gt':
            return {[filter.field]: conditionalNegation({ $gt: parseDate(filter.term, filter.field) }, negate)};
        case 'lt':
            return {[filter.field]: conditionalNegation({ $lt: parseDate(filter.term, filter.field) }, negate)};
        case 'gte':
            return {[filter.field]: conditionalNegation({ $gte: parseDate(filter.term, filter.field) }, negate)};
        case 'lte':
            return {[filter.field]: conditionalNegation({ $lte: parseDate(filter.term, filter.field) }, negate)};
        case 'rng':
            return {[filter.field]: conditionalNegation({ $gte: parseDate(filter.minTerm), $lte: parseDate(filter.maxTerm) }, negate)};
        default:
            throw new InvalidDateFilter(formatFieldErrorMessage(`Unknown filter operation: ${filter.op}`, filter.field));
    }
}

export function booleanFieldParser(filter: FilterExpression): {[key: string]: {}} {
    // Not possible for boolean values
    assertNotDefaultField(filter.field);

    // parse term to boolean
    const term = filter.term === 'true';
    const negate = isNegative(filter.prefix);
    switch (filter.op) {
        case 'eq':
            // this part looks tricky but this ensures that we evaluate missing props as being falsey
            if (term && !negate) { // term = true && negate = false
                return {[filter.field]: { $eq: term }};
            }
            if (term && negate) {// term = true && negate = true
                return {[filter.field]: { $ne: term }};
            }
            if (!term && negate) {// term = false && negate = true
                return {[filter.field]: { $eq: !term }};
            }
            // term = false && negate = false
            return {[filter.field]: { $ne: !term }};
        default:
            throw new InvalidBooleanFilter(formatFieldErrorMessage('This filter operation is not compatible with boolean types', filter.field));
    }
// tslint:disable-next-line: max-file-line-count
}
