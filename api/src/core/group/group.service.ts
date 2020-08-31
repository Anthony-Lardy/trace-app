import { BadRequestException, Injectable, NotFoundException, Inject, forwardRef, UnauthorizedException } from '@nestjs/common';

import { UserSession } from '@lib/helper';
import { FilterParams } from '@lib/search-filter';
import { findKey } from 'lodash';
import { groupFilter } from './group-filter';
import { Group } from './group.interface';
import { GroupRepository } from './group.repository';
import { CourseService } from '@core/course/course.service';

@Injectable()
export class GroupService {
    constructor(
        private readonly groupRepository: GroupRepository,
        @Inject(forwardRef(() => CourseService))
        private courseService: CourseService,
    ) {
    }

    public async getGroup(id: string): Promise<Group> {
        const group = await this.groupRepository.findByIdentifier(id);
        
        if (!group) {
            throw new NotFoundException('Group does not exist.');
        }
        
        return group;
    }

    public async createGroup(group: Partial<Group>, context: UserSession): Promise<Group> {
        await this.assertGroupUpsert(group);

        const groupCreated = await this.groupRepository.createGroup({
            ...group,
            createdAt: new Date(),
            createdBy: context.id,
            updatedAt: new Date(),
            updatedBy: context.id,
        });

        return groupCreated;
    }

    public async updateGroup(id: string, group: Partial<Group>, context: UserSession): Promise<Group> {
        const groupUpdated = await this.groupRepository.updateGroup(id, {
            ...group,
            updatedAt: new Date(),
            updatedBy: context.id,
        });

        if (!groupUpdated) {
            throw new BadRequestException('Group update failed.');
        }
        return groupUpdated;
    }

    public async deleteGroup(id: string, context: UserSession): Promise<Group> {
        await this.getGroup(id);

        const groupDeleted = await this.groupRepository.updateGroup(id, {
            deletedAt: new Date(),
            deletedBy: context.id,
            updatedAt: new Date(),
            updatedBy: context.id,
        });

        if (!groupDeleted) {
            throw new BadRequestException('Group delete failed.');
        }
        return groupDeleted;
    }

    public async listGroups(filter: FilterParams, context: UserSession): Promise<Group[]> {
        const { query, options } = this.filterParseOrFail(filter, context);

        if (!findKey(query['$and'], 'deletedAt') && !findKey(query['$and'], 'deletedBy')) {
            query['deletedAt'] = { $exists: false };
        }

        return this.groupRepository.findAll(query, options);
    }

    private filterParseOrFail(filterParams: FilterParams, context: UserSession): { query: object; options: object } {
        const {value = {query: {}, options: {}}, error} = groupFilter.parse(filterParams, context);
        if (error) {
            throw new BadRequestException(error, error.title);
        }
        return { query: value.query, options: value.options };
    }

    private async assertGroupUpsert(group: Partial<Group>): Promise<void> {
        const [course] = await Promise.all([
            group.course ? this.courseService.getCourse(group.course) : null,
        ]);

        if(course) {
            return;
        }

        throw new UnauthorizedException('Cannot link group with course');
    }

}
