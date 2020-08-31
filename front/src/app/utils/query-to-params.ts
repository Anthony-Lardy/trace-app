import { FilterParams } from '../data/models/filter.interface';
import { HttpParams } from '@angular/common/http';

export function toParams(query: FilterParams & {embed?: string} = {}): HttpParams {
    return Object.keys(query).reduce((acc: HttpParams, key) => {
        const value = query[key];
        // do nothing on undefined values
        if (!value) {
            return acc;
        }
        return acc.set(key, value.toString());
    }, new HttpParams());
}
