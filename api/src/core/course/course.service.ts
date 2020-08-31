import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { UserSession } from '@lib/helper';
import { FilterParams } from '@lib/search-filter';
import { findKey } from 'lodash';
import { courseFilter } from './course-filter';
import { Course } from './course.interface';
import { CourseRepository } from './course.repository';

@Injectable()
export class CourseService {
    constructor(
        private readonly courseRepository: CourseRepository,
    ) {
    }

    public async getCourse(id: string): Promise<Course> {
        const course = await this.courseRepository.findByIdentifier(id);
        
        if (!course) {
            throw new NotFoundException('Course does not exist.');
        }
        
        return course;
    }

    public async createCourse(course: Partial<Course>, context: UserSession): Promise<Course> {
        const courseCreated = await this.courseRepository.createCourse({
            ...course,
            createdAt: new Date(),
            createdBy: context.id,
            updatedAt: new Date(),
            updatedBy: context.id,
        });

        return courseCreated;
    }

    public async updateCourse(id: string, course: Partial<Course>, context: UserSession): Promise<Course> {
        const courseUpdated = await this.courseRepository.updateCourse(id, {
            ...course,
            updatedAt: new Date(),
            updatedBy: context.id,
        });

        if (!courseUpdated) {
            throw new BadRequestException('Course update failed.');
        }
        return courseUpdated;
    }

    public async deleteCourse(id: string, context: UserSession): Promise<Course> {
        await this.getCourse(id);

        const courseDeleted = await this.courseRepository.updateCourse(id, {
            deletedAt: new Date(),
            deletedBy: context.id,
            updatedAt: new Date(),
            updatedBy: context.id,
        });

        if (!courseDeleted) {
            throw new BadRequestException('Course delete failed.');
        }
        return courseDeleted;
    }

    public async listCourses(filter: FilterParams, context: UserSession): Promise<Course[]> {
        const { query, options } = this.filterParseOrFail(filter, context);

        if (!findKey(query['$and'], 'deletedAt') && !findKey(query['$and'], 'deletedBy')) {
            query['deletedAt'] = { $exists: false };
        }

        return this.courseRepository.findAll(query, options);
    }

    private filterParseOrFail(filterParams: FilterParams, context: UserSession): { query: object; options: object } {
        const {value = {query: {}, options: {}}, error} = courseFilter.parse(filterParams, context);
        if (error) {
            throw new BadRequestException(error, error.title);
        }
        return { query: value.query, options: value.options };
    }

}
