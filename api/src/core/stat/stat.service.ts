import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';

import { UserSession } from '@lib/helper';
import { Stat } from './stat.interface';
import { StudentService } from '@core/student/student.service';
import { ActivityService } from '@core/activity/activity.service';
import { TraceService } from '@core/trace/trace.service';
import { GroupService } from '@core/group/group.service';
import { Student } from '@core/student/student.interface';

@Injectable()
export class StatService {
    constructor(
        @Inject(forwardRef(() => GroupService))
        private groupService: GroupService,
        @Inject(forwardRef(() => StudentService))
        private studentService: StudentService,
        @Inject(forwardRef(() => ActivityService))
        private activityService: ActivityService,
        @Inject(forwardRef(() => TraceService))
        private traceService: TraceService,
    ) {
    }
 
    public async listStatsByCourse(id: string, context: UserSession): Promise<Stat> {
        const students = await this.studentService.listStudents({
            filter: `courses:${id}`,
        }, context);

        return this.computeStats(students, id, context);
    }

    public async listStatsByGroup(id: string, context: UserSession): Promise<Stat> {
        const group = await this.groupService.getGroup(id);

        if(!group) {
            throw new NotFoundException('Group not found');
        }

        const students = await this.studentService.listStudents({
            filter: `groups:(${id})`,
        }, context);

        return this.computeStats(students, group.course, context);
    }

    private async computeStats(students: Student[], courseId: string, context: UserSession): Promise<Stat> {
        const traces = await this.traceService.listTraces({
            filter: students.length && `student:(${students.map(({id}) => id).join('|')})` || ''
        }, context);

        const activities = await this.activityService.listActivities({
            filter: `course:${courseId}`
        }, context);

        return {
            students: students.map((student) => ({
                ...student,
                activities: activities.filter(({ id, course }) => traces.find(trace => trace.activity === id && trace.student === student.id)).map(({id}) => id)            })),
            activities,
        }
    }


}
