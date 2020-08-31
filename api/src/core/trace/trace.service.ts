import { BadRequestException, Injectable, NotFoundException, Inject, forwardRef, UnauthorizedException } from '@nestjs/common';

import { UserSession } from '@lib/helper';
import { FilterParams } from '@lib/search-filter';
import { findKey } from 'lodash';
import { traceFilter } from './trace-filter';
import { Trace } from './trace.interface';
import { TraceRepository } from './trace.repository';
import { ActivityService } from '@core/activity/activity.service';
import { StudentService } from '@core/student/student.service';

@Injectable()
export class TraceService {
    constructor(
        private readonly traceRepository: TraceRepository,
        @Inject(forwardRef(() => ActivityService))
        private activityService: ActivityService,
        @Inject(forwardRef(() => StudentService))
        private studentService: StudentService,
    ) {
    }

    public async getTrace(id: string): Promise<Trace> {
        const trace = await this.traceRepository.findByIdentifier(id);
        
        if (!trace) {
            throw new NotFoundException('Trace does not exist.');
        }
        
        return trace;
    }

    public async createTrace(trace: Partial<Trace>, context: UserSession): Promise<Trace> {
        await this.assertTraceUpsert(trace, context);

        const traceCreated = await this.traceRepository.createTrace({
            ...trace,
            createdAt: new Date(),
            createdBy: context.id,
            updatedAt: new Date(),
            updatedBy: context.id,
        });

        return traceCreated;
    }

    public async updateTrace(id: string, trace: Partial<Trace>, context: UserSession): Promise<Trace> {
        await this.assertTraceUpsert(trace, context);

        const traceUpdated = await this.traceRepository.updateTrace(id, {
            ...trace,
            updatedAt: new Date(),
            updatedBy: context.id,
        });

        if (!traceUpdated) {
            throw new BadRequestException('Trace update failed.');
        }
        return traceUpdated;
    }

    public async deleteTrace(id: string, context: UserSession): Promise<Trace> {
        await this.getTrace(id);

        const traceDeleted = await this.traceRepository.updateTrace(id, {
            deletedAt: new Date(),
            deletedBy: context.id,
            updatedAt: new Date(),
            updatedBy: context.id,
        });

        if (!traceDeleted) {
            throw new BadRequestException('Trace delete failed.');
        }
        return traceDeleted;
    }

    public async listTraces(filter: FilterParams, context: UserSession): Promise<Trace[]> {
        const { query, options } = this.filterParseOrFail(filter, context);

        if (!findKey(query['$and'], 'deletedAt') && !findKey(query['$and'], 'deletedBy')) {
            query['deletedAt'] = { $exists: false };
        }

        return this.traceRepository.findAll(query, options);
    }

    private filterParseOrFail(filterParams: FilterParams, context: UserSession): { query: object; options: object } {
        const {value = {query: {}, options: {}}, error} = traceFilter.parse(filterParams, context);
        if (error) {
            throw new BadRequestException(error, error.title);
        }
        return { query: value.query, options: value.options };
    }

    private async assertTraceUpsert(trace: Partial<Trace>, context: UserSession): Promise<void> {
        const [student, activity] = await Promise.all([
            trace.student ? this.studentService.getStudent(trace.student) : null,
            trace.activity ? this.activityService.getActivity(trace.activity) : null,
        ]);

        if(student && (!trace.activity || activity)) {
            return;
        }

        throw new UnauthorizedException('Cannot link trace with activity');
    }

}
