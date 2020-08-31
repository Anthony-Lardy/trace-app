import { Module, forwardRef } from '@nestjs/common';

import { StatController } from './stat.controller';
import { StatService } from './stat.service';
import { StudentModule } from '@core/student/student.module';
import { ActivityModule } from '@core/activity/activity.module';
import { GroupModule } from '@core/group/group.module';
import { TraceModule } from '@core/trace/trace.module';

@Module({
    imports: [forwardRef(() => TraceModule), forwardRef(() => StudentModule), forwardRef(() => ActivityModule), forwardRef(() => GroupModule)],
    controllers: [StatController],
    providers: [StatService],
    exports: [StatService],
})
export class StatModule {
}
