import { CourseHttp, Course } from './course.interface';

export function toCourse(course: Partial<CourseHttp>): Course {
    return {
        id: course.id || '',
        name: course.name || '',
        createdAt: course.createdAt && new Date(course.createdAt) || new Date(),
        createdBy: course.createdBy || '',
        updatedBy: course.updatedBy || '',
        updatedAt: course.updatedAt && new Date(course.updatedAt) || new Date(),
    };
}

export function fromCourse(course: Partial<Course>): CourseHttp {
    return {
        id: course.id || '',
        name: course.name || '',
    };
}
