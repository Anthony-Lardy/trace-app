import { map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FilterParams } from '@data/models/filter.interface';
import {toParams} from '../../utils/query-to-params';
import { GroupHttp, Group } from '../models/group.interface';
import { toGroup, fromGroup } from '../models/group.dto';

export const APP_SERVICE_API_ROOT = '/core/v1/groups';

@Injectable()
export class GroupService {

    constructor(
        private http: HttpClient
    ) { }

    public getGroup(userId: string): Observable<Group> {
        return this.http.get<GroupHttp>(`${APP_SERVICE_API_ROOT}/${userId}`).pipe(
            map(toGroup)
        );
    }

    public getGroups(query?: FilterParams): Observable<Group[]> {
        const params = toParams(query);
        return this.http.get<GroupHttp[]>(APP_SERVICE_API_ROOT, { params }).pipe(
            map((groups) => groups?.map(toGroup)
            )
        );
    }

    public createGroup(group: Group): Observable<Group | null> {
        return this.http.post<GroupHttp>(APP_SERVICE_API_ROOT, fromGroup(group)).pipe(
            map(groupHttp => toGroup(groupHttp)),
            catchError((error) => {
                console.log(error);
                return of(null);
            })
        );
    }

    public updateGroup(group: Partial<Group>): Observable<Group | null> {
        return this.http.patch<GroupHttp>(APP_SERVICE_API_ROOT, fromGroup(group)).pipe(
            map(groupHttp => toGroup(groupHttp)),
            catchError((error) => {
                console.log(error);
                return of(null);
            })
        );
    }

    public deleteGroup(groupId: string): Observable<Group> {
        return this.http.delete<GroupHttp>(`${APP_SERVICE_API_ROOT}/${groupId}`).pipe(
            map(toGroup)
        );
    }
}
