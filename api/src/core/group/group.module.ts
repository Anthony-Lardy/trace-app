import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { GroupController } from './group.controller';
import { GroupRepository } from './group.repository';
import { Group as GroupMongo, GroupMongoSchema } from './group.repository.schema';
import { GroupService } from './group.service';
import { CourseModule } from '@core/course/course.module';

@Module({
    imports: [MongooseModule.forFeatureAsync([
        {
            name: GroupMongo.name,
            useFactory: () => {
                const schema = GroupMongoSchema;
                schema.index({ name: 1, deletedAt: 1, course: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } });
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
    controllers: [GroupController],
    providers: [GroupRepository, GroupService],
    exports: [GroupService],
})
export class GroupModule {
}
