import { CommonModule } from '@common/common.module';
import { UserModule } from '@core/user/user.module';
import { Module } from '@nestjs/common';
import { AuthModule } from './authorization';
import { GroupModule } from '@core/group/group.module';
import { CourseModule } from '@core/course/course.module';
import { StudentModule } from '@core/student/student.module';
import { TraceModule } from '@core/trace/trace.module';
import { ActivityModule } from '@core/activity/activity.module';
import { StatModule } from '@core/stat/stat.module';

@Module({
    imports: [
        CommonModule,
        AuthModule,
        UserModule,
        GroupModule,
        CourseModule,
        StudentModule,
        TraceModule,
        ActivityModule,
        StatModule,
    ],
})
export class AppModule {
}
