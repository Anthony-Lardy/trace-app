import {compact, flattenDeep, isFunction, isString, some} from 'lodash';

import { DEFAULT_FIELD_NAME, DEFAULT_LIMIT, FilterExpression, FilterParams } from './filter';
import { ErrorCodes, UnknownFieldError, UnknownParserError } from './filter-error';
import { formatFieldErrorMessage } from './filter-utils';

export type ParserFunc = (expression: FilterExpression, options?: FieldDefinitionOptions, context?: object) => object;

export interface ParsingError {
    title: string;
    metadata: { [key: string]: string };
}

export interface ParsingErrorDetail {
    code: string;
    message: string;
}

export interface FieldDefinition {
    // field can contain dotted paths: address.zipCode, cpu.cores, ...
    // this field is the one being used to construct the database query, not just for matching
    field: string;
    // optionally can be used to match another field.
    // Aliases support en ending wildcard for partial matching: address.* will match address.zipCode, address.street, address.country.code
    alias?: string[];
    // parser can be a string to use a pre-existing parser, or an expression for custom handling
    parser: string | ParserFunc;
    options?: FieldDefinitionOptions;
}

export interface FieldDefinitionOptions {
    caseSensitive?: boolean;
    sortable?: boolean;
    // selectable is useful when a field cannot be selected. Such as for queries like "is:customer" where is doesn't relate to any field
    selectable?: boolean;
}

export interface FilterParserOptions {
    // Default is used when no field was specified
    default?: FieldDefinition;
    fields?: FieldDefinition[];
    maxLimit?: number;
    defaultLimit?: number;
    defaultSort: string;
}

// This class aims at providing a skeleton for future parsers in SQL, or others.
export abstract class FilterParser {
    protected constructor(private readonly parsers: { [index: string]: ParserFunc } = {}, protected readonly options: FilterParserOptions) { }

    // we allow any return value since we have no way to know in advance how the output will be formatted by the implemented parser
    public abstract parse(filterParams: FilterParams): any;

    protected executeExpressionParser(expression: FilterExpression, context?: object): object {
        const fieldDef = this.fetchFieldDefinition(expression.field);
        if (!fieldDef) {
            throw new UnknownFieldError(formatFieldErrorMessage(`Field does not exist`, expression.field));
        }

        // if we matched with an alias, switch the field name accordingly
        if (expression.field !== DEFAULT_FIELD_NAME && fieldDef.field !== expression.field) {
            expression.originalField = expression.field;
            expression.field = fieldDef.field;
        }

        // execute custom parser
        if (isFunction(fieldDef.parser)) {
            return fieldDef.parser(expression, fieldDef.options, context);
        }

        // execute standard parser provided as a string
        const parser = this.parsers[fieldDef.parser];
        if (!parser) {
            throw new UnknownParserError(formatFieldErrorMessage('Parser type does not exist', fieldDef.parser, 'Parser'));
        }
        return parser(expression, fieldDef.options);
    }

    protected validateLimit(value?: string | number): {value?: number, error?: ParsingErrorDetail} {
        if (!value) {
            return {value: this.options.defaultLimit || DEFAULT_LIMIT};
        }

        const limit = isString(value) ? parseInt(value): value;

        if (limit < 0) {
            return {
                error: {
                    code: ErrorCodes.InvalidLimit,
                    message: `Limit option cannot be negative`
                }
            };
        }

        if (this.options.maxLimit && limit > this.options.maxLimit) {
            return {
                error: {
                    code: ErrorCodes.InvalidLimit,
                    message: formatFieldErrorMessage(`Limit option exceeds maximum`, this.options.maxLimit.toString(), 'Limit')
                }
            };
        }
        return {value: limit};
    }

    protected validatePage(value?: string | number): {value?: number, error?: ParsingErrorDetail} {
        if (!value) {
            return {value: 1};
        }
        const page = isString(value) ? parseInt(value) : value;
        if (page < 1) {
            return {
                error: {
                    code: ErrorCodes.InvalidPage,
                    message: 'Page option cannot be less than zero.'
                }
            };
        }
        return {value: page};
    }

    protected validateSort(sort?: string): {value?: string, error?: ParsingErrorDetail} {
        if (!sort) {
            return {value: this.options.defaultSort};
        }

        const sortableFields = flattenDeep(
            this.options.fields?.filter((f: FieldDefinition) => f.options && f.options.sortable)
                .map((f: FieldDefinition) => f.alias || f.field)
        );

        const sorts = sort.split(',');
        const badSort = sorts.find((s: string) => s.startsWith('-') ? !sortableFields.includes(s.substr(1)) : !sortableFields.includes(s));

        if (badSort) {
            return {
                error: {
                    code: ErrorCodes.UnknownSort,
                    message: formatFieldErrorMessage(`Sort type does not exist`, badSort, 'Sort')
                }
            };
        }

        const value = compact(sort.split(',').map((it) => {
            const negative = it.startsWith('-');
            const def = this.fetchFieldDefinition(negative ? it.substr(1) : it);
            return def && `${negative ? '-' : ''}${def.field}`;
        }));

        return {value: value.join(',')};
    }

    protected validateFields(fields?: string | { paths: string[] }): {value?: string, error?: ParsingErrorDetail} {
        if (!fields) {
            return {};
        }

        const selectableFields = flattenDeep(
            this.options.fields?.filter((f) => f.options && f.options.selectable)
                .map((f: FieldDefinition) => f.alias || f.field)
        );

        const fieldsArray = isString(fields) ? fields.split(',') : fields.paths;
        const badFieldName = fieldsArray.find((s: any) => s.startsWith('-') ? !selectableFields.includes(s.substr(1)) : !selectableFields.includes(s));

        if (badFieldName) {
            let message = formatFieldErrorMessage(`The field is not valid`, badFieldName);
            const badField = this.options.fields?.find((f) => f.field === badFieldName);
            if (badField && badField.options && !badField.options.selectable) {
                message = formatFieldErrorMessage(`The field is not selectable`, badField.field);
            }
            return {
                error: {
                    code: ErrorCodes.InvalidField,
                    message
                }
            };
        }

        const fieldsArr = isString(fields) ? fields.split(',') : fields.paths;
        const value = compact(fieldsArr.map((it) => {
            const negative = it.startsWith('-');
            const def = this.fetchFieldDefinition(negative ? it.substr(1) : it);
            return def && `${negative ? '-' : ''}${def.field}`;
        }));

        return {
            value: value.join(',')
        };
    }

    // fetches the field definition associated with the expression.
    // If we cannot find a matching definition, we throw an error.
    private fetchFieldDefinition(field: string): FieldDefinition | undefined {
        if (field === DEFAULT_FIELD_NAME) {
            return this.options.default;
        }

        // two nested lodash iterative functions is not a great idea, this could be optimized later
        const definition = this.options.fields && this.options.fields.find((f) => {
            const fieldPattern = f.alias || [f.field];
            return some(fieldPattern, (p) => {
                return p.endsWith('*') ? field.startsWith(p.slice(0, -1)) : field === p;
            });
        });

        return definition;
    }

}
