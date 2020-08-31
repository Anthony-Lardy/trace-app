import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { convertToMongoUpdate } from '@lib/helper';
import { generateId } from '@lib/id-provider';
import { Group } from './group.interface';
import { Group as GroupMongo } from './group.repository.schema';

@Injectable()
export class GroupRepository {

    private readonly errors: Array<{matcher: RegExp, error: string}> = [
        {
            matcher: /duplicate key error.*email/,
            error: 'Email already used.'
        },
    ];
    constructor(@InjectModel(GroupMongo.name) private readonly groupModel: Model<GroupMongo>) {
    }

    public async findOne(query: object): Promise<Group | null> {
        const group = await this.groupModel.findOne(query).exec();
        return group && this.fromMongo(group);
    }

    public async findByIdentifier(identifier: string): Promise<Group | null> {        
        const group = await this.groupModel.findById(identifier).exec();
        return group && this.fromMongo(group);
    }

    public async createGroup(group: Partial<Group>): Promise<Group> {
        try {
            const id = await this.nextGeneratedId();
            const createdGroup = new this.groupModel({
                ...group,
                _id: id,
            });
            const groupCreated = await createdGroup.save();
            return this.fromMongo(groupCreated);
        } catch (error) {
            throw new BadRequestException(...this.errorManager(error));
        }
    }

    public async updateGroup(id: string, group: Partial<Group>): Promise<Group | null> {
        try {
            const res = await this.groupModel.findByIdAndUpdate(id, convertToMongoUpdate(group), {new: true}).exec();
            return res && this.fromMongo(res);
        } catch (error) {
            throw new BadRequestException(...this.errorManager(error));
        }
    }

    public async countGroups(query: object): Promise<number> {
        return this.groupModel.count(query).exec();
    }

    public async findAll(query: object, options: { limit?: number, fields?: object, skip?: number, sort?: object }): Promise<Group[]> {
        const groups = await this.groupModel
            .find(query, options.fields)
            .limit(options.limit || 1000)
            .skip(options.skip || 0)
            .sort(options.sort).exec();
        return groups.map(this.fromMongo);
    }
    
    private fromMongo(data: GroupMongo): Group {
        const {__v, _id,  ...obj} = data.toObject();
        return {
            ...obj,
            id: `${_id}`,
        };
    }

    private async nextGeneratedId(): Promise<string> {
        const id = generateId('groups');
        const existing = await this.groupModel.findById(id).exec();

        if (existing) {
            return this.nextGeneratedId();
        }

        return id;
    }

    private errorManager(error): any {
        const match = this.errors.find(({ matcher }) => matcher.exec(error?.message));
        if (match) {
            return [match.error];
        }
        return [error, error.message];
    }

}
