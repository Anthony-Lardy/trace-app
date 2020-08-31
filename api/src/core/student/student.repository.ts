import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { convertToMongoUpdate } from '@lib/helper';
import { generateId } from '@lib/id-provider';
import { Student } from './student.interface';
import { Student as StudentMongo } from './student.repository.schema';

@Injectable()
export class StudentRepository {

    private readonly errors: Array<{matcher: RegExp, error: string}> = [
        {
            matcher: /duplicate key error.*email/,
            error: 'Email already used.'
        },
    ];
    constructor(@InjectModel(StudentMongo.name) private readonly studentModel: Model<StudentMongo>) {
    }

    public async findOne(query: object): Promise<Student | null> {
        const student = await this.studentModel.findOne(query).exec();
        return student && this.fromMongo(student);
    }

    public async findByIdentifier(identifier: string): Promise<Student | null> {        
        const student = await this.studentModel.findById(identifier).exec();
        return student && this.fromMongo(student);
    }

    public async createStudent(student: Partial<Student>): Promise<Student> {
        try {
            const id = await this.nextGeneratedId();
            const createdStudent = new this.studentModel({
                ...student,
                _id: id,
            });
            const studentCreated = await createdStudent.save();
            return this.fromMongo(studentCreated);
        } catch (error) {
            throw new BadRequestException(...this.errorManager(error));
        }
    }

    public async updateStudent(id: string, student: Partial<Student>): Promise<Student | null> {
        try {
            const res = await this.studentModel.findByIdAndUpdate(id, convertToMongoUpdate(student), {new: true}).exec();
            return res && this.fromMongo(res);
        } catch (error) {
            throw new BadRequestException(...this.errorManager(error));
        }
    }

    public async countStudents(query: object): Promise<number> {
        return this.studentModel.count(query).exec();
    }

    public async findAll(query: object, options: { limit?: number, fields?: object, skip?: number, sort?: object }): Promise<Student[]> {
        const students = await this.studentModel
            .find(query, options.fields)
            .limit(options.limit || 1000)
            .skip(options.skip || 0)
            .sort(options.sort).exec();
        return students.map(this.fromMongo);
    }
    
    private fromMongo(data: StudentMongo): Student {
        const {__v, _id,  ...obj} = data.toObject();
        return {
            ...obj,
            id: `${_id}`,
        };
    }

    private async nextGeneratedId(): Promise<string> {
        const id = generateId('students');
        const existing = await this.studentModel.findById(id).exec();

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
