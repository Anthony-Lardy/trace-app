import { FilterExpression, parseFilterDsl } from './filter';
import { InvalidDateFilter, InvalidStringFilter } from './filter-error';
import { FieldDefinitionOptions, FilterParser, ParsingError, ParsingErrorDetail } from './filter-parser';
import { FilterParserOptions } from './filter-parser';
import { formatFieldErrorMessage, isNegative } from './filter-utils';

export type Operator = 'EQUAL' | 'NOT_EQUAL' | 'MATCH' | 'DO_NOT_MATCH' | 'IS_NOT_ONE_OF' | 'IS_ONE_OF' | 'CONTAIN_NOT_ALL' | 'CONTAIN_ALL' | 'SMALLER_THAN'| 'BIGGER_THAN' | 'SMALLER_OR_EQUAL_THAN' | 'BIGGER_OR_EQUAL_THAN';

export class SearchbarFilterParser extends FilterParser {
    constructor(protected readonly options: FilterParserOptions) {
        super({
            string: stringFieldParser,
            date: dateFieldParser
        }, options);
    }

    public parse({filter}: {filter?: string}): {query?: object[], error?: ParsingError} {
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
                const result = this.executeExpressionParser(expr);
                queryExpressions.push(result);
            } catch (error) {
                throw error;
            }
        }

        if (errors.some((error) => error !== undefined)) {
            return { error: {
                title: 'Invalid query argument(s)',
                metadata: transformToMetadata(errors)
            }};
        }

        return {query: queryExpressions};
    }

}

function transformToMetadata(errors: Array<ParsingErrorDetail | undefined>): {[key: string]: string} {
    return errors.filter((error) => error !== undefined).reduce((acc, {code, message}: ParsingErrorDetail) => {
        acc[code] = message;
        return acc;
      }, {});
}

// tslint:disable-next-line: cyclomatic-complexity
function stringFieldParser({field, terms, term, prefix, op}: FilterExpression, _options: FieldDefinitionOptions = {})
: {property: string, operator: Operator, value: any, query: string} {
    const negate = isNegative(prefix);
    const query = {
        value: term || terms,
        property: field,
    };
    switch (op) {
        case 'eq':
            return {
                ...query,
                operator: negate ? 'NOT_EQUAL' : 'EQUAL',
                query: `${negate ? '-' : ''}${field}:"${term}"`,
            };
        case 'txt':
            return {
                ...query,
                operator: negate ? 'DO_NOT_MATCH' : 'MATCH',
                query: `${negate ? '-' : ''}${field}:~"${term}"`,
            };
        case 'in':
            return {
                ...query,
                operator: negate ? 'IS_NOT_ONE_OF' : 'IS_ONE_OF',
                query: `${negate ? '-' : ''}${field}:("${terms.join('"|"')}")`,
            };
        case 'all':
                return {
                    ...query,
                    operator: negate ? 'CONTAIN_NOT_ALL' : 'CONTAIN_ALL',
                    query: `${negate ? '-' : ''}${field}:("${terms.join('" "')}")`,
                };
        default: throw new InvalidStringFilter(formatFieldErrorMessage(`Unknown filter operation: ${op}`, field));
    }
}

// tslint:disable-next-line: cyclomatic-complexity
function dateFieldParser({field, terms, term, prefix, op}: FilterExpression)
: {property: string, operator: Operator, value: any, query: string} {
    const strigify = (value: string) => value.trim().startsWith('-') || value.includes(' ') ? `"${value}"` : value;
    const negate = isNegative(prefix);
    const query = {
        property: field,
    };
    switch (op) {
        case 'eq':
            return {
                ...query,
                operator: negate ? 'NOT_EQUAL' : 'EQUAL',
                value: parseDate(term),
                query: `${negate ? '-' : ''}${field}:${strigify(term)}`,
            };
        case 'in':
            return {
                ...query,
                operator: negate ? 'IS_NOT_ONE_OF' : 'IS_ONE_OF',
                value: terms.map((it) => parseDate(it)),
                query: `${negate ? '-' : ''}${field}:(${terms.map(strigify).join('|')})`,
            };
        case 'gt':
            return {
                ...query,
                operator: negate ? 'SMALLER_THAN' : 'BIGGER_THAN',
                value: parseDate(term),
                query: `${field}${negate ? '<' : '>'}${strigify(term)}`,
            };
        case 'lt':
            return {
                ...query,
                operator: negate ? 'BIGGER_THAN' : 'SMALLER_THAN',
                value: parseDate(term),
                query: `${field}${negate ? '>' : '<'}${strigify(term)}`,
            };
        case 'gte':
            return {
                ...query,
                operator: negate ? 'SMALLER_OR_EQUAL_THAN' : 'BIGGER_OR_EQUAL_THAN',
                value: parseDate(term),
                query: `${field}${negate ? '<' : '>'}=${strigify(term)}`,
            };
        case 'lte':
            return {
                ...query,
                operator: negate ? 'BIGGER_OR_EQUAL_THAN' : 'SMALLER_OR_EQUAL_THAN',
                value: parseDate(term),
                query: `${field}${negate ? '>' : '<'}=${strigify(term)}`,
            };
        default: throw new InvalidStringFilter(formatFieldErrorMessage(`Unknown filter operation: ${op}`, field));
    }
}

function parseDate(dateAsString?: string, field?: string): string {
    if (!dateAsString) {
        throw new InvalidDateFilter(formatFieldErrorMessage('Empty or null value cannot be converted to a date', field));
    }

    const value = new Date(dateAsString);

    if ((value.getTime() === value.getTime())) {
        return dateAsString;
    }
    const match = dateAsString.match(/[0-9]+(?: *[a-zA-Z]+)/g);
    if (match) {
        return dateAsString;
    }

    throw new InvalidDateFilter(formatFieldErrorMessage('Invalid filter value for date', field));
}
