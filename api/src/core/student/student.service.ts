import { BadRequestException, Injectable, NotFoundException, Inject, forwardRef, UnauthorizedException } from '@nestjs/common';

import { UserSession } from '@lib/helper';
import { FilterParams } from '@lib/search-filter';
import { findKey } from 'lodash';
import { studentFilter } from './student-filter';
import { Student } from './student.interface';
import { StudentRepository } from './student.repository';
import { CourseService } from '@core/course/course.service';
import { GroupService } from '@core/group/group.service';

@Injectable()
export class StudentService {
    constructor(
        private readonly studentRepository: StudentRepository,
        @Inject(forwardRef(() => CourseService))
        private courseService: CourseService,
        @Inject(forwardRef(() => GroupService))
        private groupService: GroupService,
    ) {
    }

    public async getStudent(id: string): Promise<Student> {
        const student = await this.studentRepository.findByIdentifier(id);
        
        if (!student) {
            throw new NotFoundException('Student does not exist.');
        }
        
        return student;
    }

    public async createStudent(student: Partial<Student>, context: UserSession): Promise<Student> {
        await this.assertStudentUpsert(student, context);

        const studentCreated = await this.studentRepository.createStudent({
            ...student,
            createdAt: new Date(),
            createdBy: context.id,
            updatedAt: new Date(),
            updatedBy: context.id,
        });

        return studentCreated;
    }

    public async updateStudent(id: string, student: Partial<Student>, context: UserSession): Promise<Student> {
        await this.assertStudentUpsert(student, context);

        const studentUpdated = await this.studentRepository.updateStudent(id, {
            ...student,
            updatedAt: new Date(),
            updatedBy: context.id,
        });

        if (!studentUpdated) {
            throw new BadRequestException('Student update failed.');
        }
        return studentUpdated;
    }

    public async deleteStudent(id: string, context: UserSession): Promise<Student> {
        await this.getStudent(id);

        const studentDeleted = await this.studentRepository.updateStudent(id, {
            deletedAt: new Date(),
            deletedBy: context.id,
            updatedAt: new Date(),
            updatedBy: context.id,
        });

        if (!studentDeleted) {
            throw new BadRequestException('Student delete failed.');
        }
        return studentDeleted;
    }

    public async listStudents(filter: FilterParams, context: UserSession): Promise<Student[]> {
        const { query, options } = this.filterParseOrFail(filter, context);

        if (!findKey(query['$and'], 'deletedAt') && !findKey(query['$and'], 'deletedBy')) {
            query['deletedAt'] = { $exists: false };
        }

        return this.studentRepository.findAll(query, options);
    }

    private filterParseOrFail(filterParams: FilterParams, context: UserSession): { query: object; options: object } {
        const {value = {query: {}, options: {}}, error} = studentFilter.parse(filterParams, context);
        if (error) {
            throw new BadRequestException(error, error.title);
        }
        return { query: value.query, options: value.options };
    }

    private async assertStudentUpsert(student: Partial<Student>, context: UserSession): Promise<void> {
        const [courses, groups] = await Promise.all([
            student.courses?.length ? this.courseService.listCourses({
                filter: `id:(${student.courses.join('|')})`
            }, context) : [],
            student.groups?.length ? this.groupService.listGroups({
                filter: `id:(${student.groups.join('|')})`
            }, context) : [],
        ]);

        if(courses?.length === student.courses?.length && student.groups?.length === groups.length) {
            return;
        }

        throw new UnauthorizedException('Cannot link student with courses or groups');
    }

}
