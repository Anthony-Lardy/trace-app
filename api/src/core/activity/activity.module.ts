import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ActivityController } from './activity.controller';
import { ActivityRepository } from './activity.repository';
import { Activity as ActivityMongo, ActivityMongoSchema } from './activity.repository.schema';
import { ActivityService } from './activity.service';
import { CourseModule } from '@core/course/course.module';

@Module({
    imports: [MongooseModule.forFeatureAsync([
        {
            name: ActivityMongo.name,
            useFactory: () => {
                const schema = ActivityMongoSchema;
                schema.index({ name: 1, deletedAt: 1, course: 1, type: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } });
                schema.index('createdAt');
                schema.index('createdBy');
                schema.index('updatedAt');
                schema.index('updatedBy');
                schema.index('deletedAt');
                schema.index('deletedBy');
                return schema;
            },
        },
    ]), forwardRef(() => CourseModule)],
    controllers: [ActivityController],
    providers: [ActivityRepository, ActivityService],
    exports: [ActivityService],
})
export class ActivityModule {
}
