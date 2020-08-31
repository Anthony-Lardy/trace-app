import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { StudentController } from './student.controller';
import { StudentRepository } from './student.repository';
import { Student as StudentMongo, StudentMongoSchema } from './student.repository.schema';
import { StudentService } from './student.service';
import { CourseModule } from '@core/course/course.module';
import { GroupModule } from '@core/group/group.module';

@Module({
    imports: [MongooseModule.forFeatureAsync([
        {
            name: StudentMongo.name,
            useFactory: () => {
                const schema = StudentMongoSchema;
                schema.index({ firstName: 1, lastName: 1, deletedAt: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } });
                schema.index('courses');
                schema.index('createdAt');
                schema.index('createdBy');
                schema.index('updatedAt');
                schema.index('updatedBy');
                schema.index('deletedAt');
                schema.index('deletedBy');
                return schema;
            },
        },
    ]), forwardRef(() => CourseModule), forwardRef(() => GroupModule)],
    controllers: [StudentController],
    providers: [StudentRepository, StudentService],
    exports: [StudentService],
})
export class StudentModule {
}
