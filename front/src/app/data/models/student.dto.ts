import { StudentHttp, Student } from './student.interface';

export function toStudent(student: Partial<StudentHttp>): Student {
    return {
        id: student.id || '',
        firstName: student.firstName || '',
        lastName: student.lastName || '',
        createdAt: student.createdAt && new Date(student.createdAt) || new Date(),
        createdBy: student.createdBy || '',
        updatedBy: student.updatedBy || '',
        updatedAt: student.updatedAt && new Date(student.updatedAt) || new Date(),
        courses: student.courses || []
    };
}

export function fromStudent(student: Partial<Student>): StudentHttp {
    return {
        id: student.id || '',
        firstName: student.firstName || '',
        lastName: student.lastName || '',
        courses: student.courses || []
    };
}
