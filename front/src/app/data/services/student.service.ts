import { map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FilterParams } from '@data/models/filter.interface';
import {toParams} from '../../utils/query-to-params';
import { StudentHttp, Student } from '../models/student.interface';
import { toStudent, fromStudent } from '../models/student.dto';

export const APP_SERVICE_API_ROOT = '/core/v1/students';

@Injectable()
export class StudentService {

    constructor(
        private http: HttpClient
    ) { }

    public getStudent(userId: string): Observable<Student> {
        return this.http.get<StudentHttp>(`${APP_SERVICE_API_ROOT}/${userId}`).pipe(
            map(toStudent)
        );
    }

    public getStudents(query?: FilterParams): Observable<Student[]> {
        const params = toParams(query);
        return this.http.get<StudentHttp[]>(APP_SERVICE_API_ROOT, { params }).pipe(
            map((students) => students?.map(toStudent)
            )
        );
    }

    public createStudent(student: Student): Observable<Student | null> {
        return this.http.post<StudentHttp>(APP_SERVICE_API_ROOT, fromStudent(student)).pipe(
            map(studentHttp => toStudent(studentHttp)),
            catchError((error) => {
                console.log(error);
                return of(null);
            })
        );
    }

    public updateStudent(student: Partial<Student>): Observable<Student | null> {
        return this.http.patch<StudentHttp>(APP_SERVICE_API_ROOT, fromStudent(student)).pipe(
            map(studentHttp => toStudent(studentHttp)),
            catchError((error) => {
                console.log(error);
                return of(null);
            })
        );
    }

    public deleteStudent(studentId: string): Observable<Student> {
        return this.http.delete<StudentHttp>(`${APP_SERVICE_API_ROOT}/${studentId}`).pipe(
            map(toStudent)
        );
    }
}
