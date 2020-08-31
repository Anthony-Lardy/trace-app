import { map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FilterParams } from '@data/models/filter.interface';
import {toParams} from '../../utils/query-to-params';
import { CourseHttp, Course } from '../models/course.interface';
import { toCourse, fromCourse } from '../models/course.dto';

export const APP_SERVICE_API_ROOT = '/core/v1/courses';

@Injectable()
export class CourseService {

    constructor(
        private http: HttpClient
    ) { }

    public getCourse(userId: string): Observable<Course> {
        return this.http.get<CourseHttp>(`${APP_SERVICE_API_ROOT}/${userId}`).pipe(
            map(toCourse)
        );
    }

    public getCourses(query?: FilterParams): Observable<Course[]> {
        const params = toParams(query);
        return this.http.get<CourseHttp[]>(APP_SERVICE_API_ROOT, { params }).pipe(
            map((courses) => courses?.map(toCourse)
            )
        );
    }

    public createCourse(course: Course): Observable<Course | null> {
        return this.http.post<CourseHttp>(APP_SERVICE_API_ROOT, fromCourse(course)).pipe(
            map(courseHttp => toCourse(courseHttp)),
            catchError((error) => {
                console.log(error);
                return of(null);
            })
        );
    }

    public updateCourse(course: Partial<Course>): Observable<Course | null> {
        return this.http.patch<CourseHttp>(APP_SERVICE_API_ROOT, fromCourse(course)).pipe(
            map(courseHttp => toCourse(courseHttp)),
            catchError((error) => {
                console.log(error);
                return of(null);
            })
        );
    }

    public deleteCourse(courseId: string): Observable<Course> {
        return this.http.delete<CourseHttp>(`${APP_SERVICE_API_ROOT}/${courseId}`).pipe(
            map(toCourse)
        );
    }
}
