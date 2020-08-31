import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CourseController } from './course.controller';
import { CourseRepository } from './course.repository';
import { Course as CourseMongo, CourseMongoSchema } from './course.repository.schema';
import { CourseService } from './course.service';

@Module({
    imports: [MongooseModule.forFeatureAsync([
        {
            name: CourseMongo.name,
            useFactory: () => {
                const schema = CourseMongoSchema;
                schema.index({ name:1, deletedAt: 1, createdBy: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } });
                schema.index('createdAt');
                schema.index('createdBy');
                schema.index('updatedAt');
                schema.index('updatedBy');
                schema.index('deletedAt');
                schema.index('deletedBy');
                return schema;
            },
        },
    ])],
    controllers: [CourseController],
    providers: [CourseRepository, CourseService],
    exports: [CourseService],
})
export class CourseModule {
}
