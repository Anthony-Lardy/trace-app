import { BadRequestException, Injectable, NotFoundException, Inject, forwardRef, UnauthorizedException } from '@nestjs/common';

import { UserSession } from '@lib/helper';
import { FilterParams } from '@lib/search-filter';
import { findKey } from 'lodash';
import { activityFilter } from './activity-filter';
import { Activity } from './activity.interface';
import { ActivityRepository } from './activity.repository';
import { CourseService } from '@core/course/course.service';

@Injectable()
export class ActivityService {
    constructor(
        private readonly activityRepository: ActivityRepository,
        @Inject(forwardRef(() => CourseService))
        private courseService: CourseService,
    ) {
    }

    public async getActivity(id: string): Promise<Activity> {
        const activity = await this.activityRepository.findByIdentifier(id);
        
        if (!activity) {
            throw new NotFoundException('Activity does not exist.');
        }
        
        return activity;
    }

    public async createActivity(activity: Partial<Activity>, context: UserSession): Promise<Activity> {
        await this.assertActivityUpsert(activity);

        const activityCreated = await this.activityRepository.createActivity({
            ...activity,
            createdAt: new Date(),
            createdBy: context.id,
            updatedAt: new Date(),
            updatedBy: context.id,
        });

        return activityCreated;
    }

    public async updateActivity(id: string, activity: Partial<Activity>, context: UserSession): Promise<Activity> {
        const activityUpdated = await this.activityRepository.updateActivity(id, {
            ...activity,
            updatedAt: new Date(),
            updatedBy: context.id,
        });

        if (!activityUpdated) {
            throw new BadRequestException('Activity update failed.');
        }
        return activityUpdated;
    }

    public async deleteActivity(id: string, context: UserSession): Promise<Activity> {
        await this.getActivity(id);

        const activityDeleted = await this.activityRepository.updateActivity(id, {
            deletedAt: new Date(),
            deletedBy: context.id,
            updatedAt: new Date(),
            updatedBy: context.id,
        });

        if (!activityDeleted) {
            throw new BadRequestException('Activity delete failed.');
        }
        return activityDeleted;
    }

    public async listActivities(filter: FilterParams, context: UserSession): Promise<Activity[]> {
        const { query, options } = this.filterParseOrFail(filter, context);

        if (!findKey(query['$and'], 'deletedAt') && !findKey(query['$and'], 'deletedBy')) {
            query['deletedAt'] = { $exists: false };
        }

        return this.activityRepository.findAll(query, options);
    }

    private filterParseOrFail(filterParams: FilterParams, context: UserSession): { query: object; options: object } {
        const {value = {query: {}, options: {}}, error} = activityFilter.parse(filterParams, context);
        if (error) {
            throw new BadRequestException(error, error.title);
        }
        return { query: value.query, options: value.options };
    }

    private async assertActivityUpsert(activity: Partial<Activity>): Promise<void> {
        const [course] = await Promise.all([
            activity.course ? this.courseService.getCourse(activity.course) : null,
        ]);

        if(course) {
            return;
        }

        throw new UnauthorizedException('Cannot link activity with course');
    }

}
