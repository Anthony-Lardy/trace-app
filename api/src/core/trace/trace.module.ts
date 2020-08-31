import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TraceController } from './trace.controller';
import { TraceRepository } from './trace.repository';
import { Trace as TraceMongo, TraceMongoSchema } from './trace.repository.schema';
import { TraceService } from './trace.service';
import { ActivityModule } from '@core/activity/activity.module';
import { StudentModule } from '@core/student/student.module';

@Module({
    imports: [MongooseModule.forFeatureAsync([
        {
            name: TraceMongo.name,
            useFactory: () => {
                const schema = TraceMongoSchema;
                schema.index('action');
                schema.index('activity');
                schema.index('student');
                schema.index('source');
                schema.index('payload');
                schema.index('createdAt');
                schema.index('createdBy');
                schema.index('updatedAt');
                schema.index('updatedBy');
                schema.index('deletedAt');
                schema.index('deletedBy');
                return schema;
            },
        },
    ]), forwardRef(() => StudentModule), forwardRef(() => ActivityModule)],
    controllers: [TraceController],
    providers: [TraceRepository, TraceService],
    exports: [TraceService],
})
export class TraceModule {
}
