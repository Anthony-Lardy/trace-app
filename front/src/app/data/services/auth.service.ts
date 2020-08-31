import { map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '@env/environment';

export const AUTH_API_URL = `${environment.api_url}/auth/v1`;

@Injectable()
export class AuthService {

    constructor(
        private http: HttpClient
    ) { }

    public login(email: string, password: string): Observable<string | null> {
        return this.http.post<{'access_token': string}>(`${AUTH_API_URL}/login`, {
            email,
            password,
        }).pipe(
            map(response => {
                return response.access_token;
            }),
            catchError((error) => {
                console.log(error);
                return of(null);
            }),
        );
    }
}
