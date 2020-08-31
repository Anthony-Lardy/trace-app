import { get, isEmpty } from "lodash";
import { isBoolean, isDate, isNumber } from "util";

export interface UserSession {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
}

export function convertToMongoUpdate<T extends object>(payload: T): { $set: Partial<T>, $unset?: {[key: string]: ''}} {
    const result = Object.keys(payload).reduce((acc, path) => {
        const value = get(payload, path);
        if (value === undefined) {
            return acc;
        }
        if (!isNumber(value) && !isDate(value) && !isBoolean(value) && isEmpty(value)) {
            acc.unset[path] = '';
            return acc;
        }
        acc.set[path] = value;
        return acc;
    }, {set: {}, unset: {}} as { set: Partial<T>, unset: {[key: string]: ''} });
    const updateObject: { $set: Partial<T>, $unset?: {[key: string]: ''} } = { $set: result.set };
    if (!isEmpty(result.unset)) { updateObject.$unset = result.unset; }
    return updateObject;
}

export type Entity =
    | 'user'
