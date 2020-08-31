import { Injectable } from '@angular/core';
import { LocalStorageService } from '@shared/services/storage.service';
import { User } from '@data/models/user.interface';
import { Course } from '@data/models/course.interface';

export const USER_KEY = 'usr';
export const COURSES_KEY = 'crs';

@Injectable({
    providedIn: 'root',
})
export class SettingsService {

    get user() {
        return this.store.get(USER_KEY);
    }

    get courses() {
        return this.store.get(COURSES_KEY);
    }

    constructor(private store: LocalStorageService) { }

    setUser(value: User) {
        this.store.set(USER_KEY, value);
    }

    removeUser() {
        this.store.remove(USER_KEY);
    }

    setCourses(value: Course[]) {
        this.store.set(COURSES_KEY, value);
    }

    removeCourses() {
        this.store.remove(COURSES_KEY);
    }
}
