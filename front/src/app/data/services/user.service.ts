import { map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { UserHttp, User, UserCreation } from '@data/models/user.interface';
import { FilterParams } from '@data/models/filter.interface';
import {toParams} from '../../utils/query-to-params';
import { toUser, fromUser } from '@data/models/user.dto';

export const APP_SERVICE_API_ROOT = '/core/v1/users';

@Injectable()
export class UserService {

    constructor(
        private http: HttpClient
    ) { }

    public getUser(userId: string): Observable<User> {
        return this.http.get<UserHttp>(`${APP_SERVICE_API_ROOT}/${userId}`).pipe(
            map(toUser)
        );
    }

    public getUsers(query?: FilterParams): Observable<User[]> {
        const params = toParams(query);
        return this.http.get<UserHttp[]>(APP_SERVICE_API_ROOT, { params }).pipe(
            map(users => users?.map(toUser)
            )
        );
    }

    public createUser(user: UserCreation): Observable<User | null> {
        return this.http.post<UserHttp>(APP_SERVICE_API_ROOT, user).pipe(
            map(userHttp => toUser(userHttp)),
            catchError((error) => {
                console.log(error);
                return of(null);
            })
        );
    }

    public updateUser(user: Partial<User>): Observable<User | null> {
        return this.http.patch<UserHttp>(APP_SERVICE_API_ROOT, fromUser(user)).pipe(
            map(userHttp => toUser(userHttp)),
            catchError((error) => {
                console.log(error);
                return of(null);
            })
        );
    }

    public deleteUser(userId: string): Observable<User> {
        return this.http.delete<UserHttp>(`${APP_SERVICE_API_ROOT}/${userId}`).pipe(
            map(toUser)
        );
    }
}
