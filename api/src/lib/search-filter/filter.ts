import {isEmpty} from 'lodash';
import * as nearley from 'nearley';

import { ParsingErrorDetail } from './';
import { ErrorCodes } from './filter-error';
import * as grammar from './filter-grammar';

export const DEFAULT_FIELD_NAME = '<default>';

export const DEFAULT_LIMIT = 1000;

export interface FilterExpression {
    prefix?: '-' | '+';
    field: string; // firstName, address.zipCode, ...
    originalField: string;
    fieldParts: string[]; // ["firstName"] ["address", "zipCode"], ...
    term: string;
    terms: string[];
    minTerm?: string;
    maxTerm?: string;
    op: 'eq' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'txt' | 'rng' | 'all';
}

export interface FilterParams {
    filter?: string;
    limit?: string | number;
    fields?: string;
    sort?: string;
    page?: string | number;
}

export function parseFilterDsl(filter: string): {filterExpressions?: FilterExpression[], error?: ParsingErrorDetail} {
    if (isEmpty(filter)) {
        return {filterExpressions: []};
    }

    // Create a Parser object from our grammar. This should not be a singleton as it supports streaming!
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

    try {
        parser.feed(filter);
    } catch (error) {
        return {error: {code: ErrorCodes.ParseFilterError, message: error.message}};
    }
    if (!parser.results || !parser.results.length) {
        return {error: {code: ErrorCodes.ParseFilterError, message: `Cannot execute your query, it seems to be ambiguous.`}};
    }

    // we only have one results since the filter is not supposed to be ambiguous
    return { filterExpressions: parser.results[0]};
}

function splitSearchQuery(str: string): string[] {
    const regexp = /((([^\s]+:)?("[^\"]*"))|([^\s"]+:(\(.*\)))|"|[^\s]+)/gm;
    const results: string[] = [];
    let m;
    m = regexp.exec(str);
    while (m !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regexp.lastIndex) {
            regexp.lastIndex++;
        }

        // The result can be accessed through the `m`-variable.
        results.push(m[0]);
        m = regexp.exec(str);
    }
    return results;
}

export function parseSoftFilterDsl(filter: string): {validatedFilter: string, filterExpressions: FilterExpression[], errors?: ParsingErrorDetail[]} {
    const errors: ParsingErrorDetail[] = [];
    let validatedFilter = '';
    if (isEmpty(filter)) {
        return {validatedFilter, filterExpressions: [], errors};
    }

    // Create a Parser object from our grammar. This should not be a singleton as it supports streaming!
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

    let first = true;
    let filterExpressions: FilterExpression[] = [];
    for (const expression of splitSearchQuery(filter)) {
        if (expression === '"') {
            errors.push({code: ErrorCodes.ParseSoftFilterError, message: 'Unexpected synthax.'});
            continue;
        }
        const save = parser.save();
        try {
            parser.feed(first ? expression : ' ' + expression);
        } catch (error) {
            errors.push({code: ErrorCodes.ParseSoftFilterError, message: `Cannot execute your query, it seems to be ambiguous with: '${error.token.value}'`});
            parser.restore(save);
            continue;
        }
        if (parser.results && parser.results.length > 1) {
            errors.push({code: ErrorCodes.ParseSoftFilterError, message: 'Cannot execute your query, it seems to be ambiguous'});
            parser.restore(save);
            continue;
        }
        validatedFilter += first ? expression : ' ' + expression;
        first = false;
        // we only have one results since the filter is not supposed to be ambiguous
        filterExpressions = parser.results[0];
    }

    return { validatedFilter: filterExpressions && filterExpressions.length > 0 ? validatedFilter : '', filterExpressions, errors};
}
