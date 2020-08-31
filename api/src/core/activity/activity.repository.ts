import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { convertToMongoUpdate } from '@lib/helper';
import { generateId } from '@lib/id-provider';
import { Activity } from './activity.interface';
import { Activity as ActivityMongo } from './activity.repository.schema';

@Injectable()
export class ActivityRepository {

    private readonly errors: Array<{matcher: RegExp, error: string}> = [
        {
            matcher: /duplicate key error.*email/,
            error: 'Email already used.'
        },
    ];
    constructor(@InjectModel(ActivityMongo.name) private readonly activityModel: Model<ActivityMongo>) {
    }

    public async findOne(query: object): Promise<Activity | null> {
        const activity = await this.activityModel.findOne(query).exec();
        return activity && this.fromMongo(activity);
    }

    public async findByIdentifier(identifier: string): Promise<Activity | null> {        
        const activity = await this.activityModel.findById(identifier).exec();
        return activity && this.fromMongo(activity);
    }

    public async createActivity(activity: Partial<Activity>): Promise<Activity> {
        try {
            const id = await this.nextGeneratedId();
            const createdActivity = new this.activityModel({
                ...activity,
                _id: id,
            });
            const activityCreated = await createdActivity.save();
            return this.fromMongo(activityCreated);
        } catch (error) {
            throw new BadRequestException(...this.errorManager(error));
        }
    }

    public async updateActivity(id: string, activity: Partial<Activity>): Promise<Activity | null> {
        try {
            const res = await this.activityModel.findByIdAndUpdate(id, convertToMongoUpdate(activity), {new: true}).exec();
            return res && this.fromMongo(res);
        } catch (error) {
            throw new BadRequestException(...this.errorManager(error));
        }
    }

    public async countActivitys(query: object): Promise<number> {
        return this.activityModel.count(query).exec();
    }

    public async findAll(query: object, options: { limit?: number, fields?: object, skip?: number, sort?: object }): Promise<Activity[]> {
        const activitys = await this.activityModel
            .find(query, options.fields)
            .limit(options.limit || 1000)
            .skip(options.skip || 0)
            .sort(options.sort).exec();
        return activitys.map(this.fromMongo);
    }
    
    private fromMongo(data: ActivityMongo): Activity {
        const {__v, _id,  ...obj} = data.toObject();
        return {
            ...obj,
            id: `${_id}`,
        };
    }

    private async nextGeneratedId(): Promise<string> {
        const id = generateId('activities');
        const existing = await this.activityModel.findById(id).exec();

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
