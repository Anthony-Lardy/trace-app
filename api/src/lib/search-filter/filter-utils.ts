import {camelCase, compact, snakeCase} from 'lodash';

/**
 * Improved CamelCase cast with dot support
 *
 * Improves the casting of a string containing dots (such as "server.cpu") to
 * CamelCase by keeping the dots.
 */
export function camelCasePath(dotSeparatedPath: string): string {
    return dotSeparatedPath.split('.').map(camelCaseWithSign).join('.');
}

/**
 * Improved SnakeCase cast with dot support
 *
 * Improves the casting of a string containing dots (such as "server.cpu") to
 * SnakeCase by keeping the dots.
 */
export function snakeCasePath(dotSeparatedPath: string): string {
    return dotSeparatedPath.split('.').map(snakeCaseWithSign).join('.');
}

/**
 * Format a string using the provided formatter into a string array
 */
export function formatCommaSeparatedString(value: string = '', formatter: (val: string) => string): string[] {
    return compact(value.split(',')).map((v) => {
        return formatter(v);
    });
}

/**
 * Just like _.snakeCase but conserving leading dash sign
 */
export function snakeCaseWithSign(value: string): string {
    if (!value) { return value; }
    return value[0] === '-' ? '-' + snakeCase(value.substring(1)) : snakeCase(value);
}

/**
 * Just like _.camelCase but conserving leading dash sign
 */
export function camelCaseWithSign(value: string): string {
    if (!value) { return value; }
    return value[0] === '-' ? '-' + camelCase(value.substring(1)) : camelCase(value);
}

export function isNegative(prefix?: string): boolean {
    return prefix === '-';
}

export function formatFieldErrorMessage(message: string, field?: string, customLabel?: string): string {
    return field ? `${message} (${customLabel ? customLabel : 'Field'}: ${field}).` : `${message}.`;
}
