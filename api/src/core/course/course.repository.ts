import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { convertToMongoUpdate } from '@lib/helper';
import { generateId } from '@lib/id-provider';
import { Course } from './course.interface';
import { Course as CourseMongo } from './course.repository.schema';

@Injectable()
export class CourseRepository {

    private readonly errors: Array<{matcher: RegExp, error: string}> = [
        {
            matcher: /duplicate key error.*email/,
            error: 'Email already used.'
        },
    ];
    constructor(@InjectModel(CourseMongo.name) private readonly courseModel: Model<CourseMongo>) {
    }

    public async findOne(query: object): Promise<Course | null> {
        const course = await this.courseModel.findOne(query).exec();
        return course && this.fromMongo(course);
    }

    public async findByIdentifier(identifier: string): Promise<Course | null> {        
        const course = await this.courseModel.findById(identifier).exec();
        return course && this.fromMongo(course);
    }

    public async createCourse(course: Partial<Course>): Promise<Course> {
        try {
            const id = await this.nextGeneratedId();
            const createdCourse = new this.courseModel({
                ...course,
                _id: id,
            });
            const courseCreated = await createdCourse.save();
            return this.fromMongo(courseCreated);
        } catch (error) {
            throw new BadRequestException(...this.errorManager(error));
        }
    }

    public async updateCourse(id: string, course: Partial<Course>): Promise<Course | null> {
        try {
            const res = await this.courseModel.findByIdAndUpdate(id, convertToMongoUpdate(course), {new: true}).exec();
            return res && this.fromMongo(res);
        } catch (error) {
            throw new BadRequestException(...this.errorManager(error));
        }
    }

    public async countCourses(query: object): Promise<number> {
        return this.courseModel.count(query).exec();
    }

    public async findAll(query: object, options: { limit?: number, fields?: object, skip?: number, sort?: object }): Promise<Course[]> {
        const courses = await this.courseModel
            .find(query, options.fields)
            .limit(options.limit || 1000)
            .skip(options.skip || 0)
            .sort(options.sort).exec();
        return courses.map(this.fromMongo);
    }
    
    private fromMongo(data: CourseMongo): Course {
        const {__v, _id,  ...obj} = data.toObject();
        return {
            ...obj,
            id: `${_id}`,
        };
    }

    private async nextGeneratedId(): Promise<string> {
        const id = generateId('courses');
        const existing = await this.courseModel.findById(id).exec();

        if (existing) {
            return this.nextGeneratedId();
        }

        return id;
    }

    private errorManager(error): any {
        const match = this.errors.find(({ matcher }) => matcher.exec(error?.message));
        if (match) {
            return [match.error];
        }
        return [error, error.message];
    }

}
