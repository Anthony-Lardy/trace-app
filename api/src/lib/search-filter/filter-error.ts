import { BadRequestException } from "@nestjs/common";

// tslint:disable: max-classes-per-file
export class FilterError extends BadRequestException {
    public code: string;
    constructor(code: string, message?: string) {
        super(message);
        this.code = code;
    }
}

export enum ErrorCodes {
    MetadataParserError = 'METADATA-PARSER-ERROR',
    StringParserError = 'STRING-PARSER-ERROR',
    NumberParserError = 'NUMBER-PARSER-ERROR',
    DateParserError = 'DATE-PARSER-ERROR',
    BooleanParserError = 'BOOLEAN-PARSER-ERROR',
    InvalidField = 'INVALID-FIELD',
    UnknownField = 'UNKNOWN-FIELD',
    UnknownParser = 'UNKNOWN-PARSER',
    InvalidLimit = 'INVALID-LIMIT',
    InvalidPage = 'INVALID-PAGE',
    UnknownSort = 'UNKNOWN-SORT',
    AttributeParserError = 'ATTRIBUTES-PARSER-ERROR',
    ParseFilterError = 'PARSE-FILTER-ERROR',
    ParseSoftFilterError = 'PARSE-SOFT-FILTER-ERROR',
}

export class InvalidMetadataFilter extends FilterError {
    constructor(message?: string) {
        super(ErrorCodes.MetadataParserError, message);
        Object.setPrototypeOf(this, FilterError.prototype);
    }
}

export class InvalidStringFilter extends FilterError {
    constructor(message?: string) {
        super(ErrorCodes.StringParserError, message);
        Object.setPrototypeOf(this, FilterError.prototype);
    }
}

export class InvalidNumberFilter extends FilterError {
    constructor(message?: string) {
        super(ErrorCodes.NumberParserError, message);
        Object.setPrototypeOf(this, FilterError.prototype);
    }
}

export class InvalidDateFilter extends FilterError {
    constructor(message?: string) {
        super(ErrorCodes.DateParserError, message);
        Object.setPrototypeOf(this, FilterError.prototype);
    }
}

export class InvalidBooleanFilter extends FilterError {
    constructor(message?: string) {
        super(ErrorCodes.BooleanParserError, message);
        Object.setPrototypeOf(this, FilterError.prototype);
    }
}

export class InvalidFieldError extends FilterError {
    constructor(message?: string) {
        super(ErrorCodes.InvalidField, message);
        Object.setPrototypeOf(this, FilterError.prototype);
    }
}

export class UnknownFieldError extends FilterError {
    constructor(message?: string) {
        super(ErrorCodes.UnknownField, message);
        Object.setPrototypeOf(this, FilterError.prototype);
    }
}

export class UnknownParserError extends FilterError {
    constructor(message?: string) {
        super(ErrorCodes.UnknownParser, message);
        Object.setPrototypeOf(this, FilterError.prototype);
    }
}

export class InvalidLimitError extends FilterError {
    constructor(message?: string) {
        super(ErrorCodes.InvalidLimit, message);
        Object.setPrototypeOf(this, FilterError.prototype);
    }
}

export class InvalidPageError extends FilterError {
    constructor(message?: string) {
        super(ErrorCodes.InvalidPage, message);
        Object.setPrototypeOf(this, FilterError.prototype);
    }
}

export class UnknownSortError extends FilterError {
    constructor(message?: string) {
        super(ErrorCodes.UnknownSort, message);
        Object.setPrototypeOf(this, FilterError.prototype);
    }
}

export class InvalidAttributeFilter extends FilterError {
    constructor (message?: string) {
        super(ErrorCodes.AttributeParserError, message);
        Object.setPrototypeOf(this, FilterError.prototype);
    }
}
