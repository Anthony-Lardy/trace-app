import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Stat, StatHttp } from '../models/stat.interface';
import { toStat } from '../models/stat.dto';

export const APP_SERVICE_API_ROOT = '/core/v1/stats';

@Injectable()
export class StatService {

    constructor(
        private http: HttpClient
    ) { }

    public getStatByCourse(courseId: string): Observable<Stat> {
        return this.http.get<StatHttp>(`${APP_SERVICE_API_ROOT}/courses/${courseId}`).pipe(
            map(toStat)
        );
    }

    public getStatByGroup(groupId: string): Observable<Stat> {
        return this.http.get<StatHttp>(`${APP_SERVICE_API_ROOT}/groups/${groupId}`).pipe(
            map(toStat)
        );
    }

}
