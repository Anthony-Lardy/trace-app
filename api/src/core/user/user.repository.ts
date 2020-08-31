import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { convertToMongoUpdate } from '@lib/helper';
import { generateId } from '@lib/id-provider';
import { User } from './user.interface';
import { User as UserMongo } from './user.repository.schema';

@Injectable()
export class UserRepository {

    private readonly errors: Array<{matcher: RegExp, error: string}> = [
        {
            matcher: /duplicate key error.*email/,
            error: 'Email already used.'
        },
    ];
    constructor(@InjectModel(UserMongo.name) private readonly userModel: Model<UserMongo>) {
    }

    public async findOne(query: object): Promise<User | null> {
        const user = await this.userModel.findOne(query).exec();
        return user && this.fromMongo(user);
    }

    public async findByIdentifier(identifier: string): Promise<User | null> {        
        const isEmail = this.isEmail(identifier);
        const user = isEmail ?
        await this.userModel.findOne({ email: identifier }).exec()
        : await this.userModel.findById(identifier).exec();
        return user && this.fromMongo(user);
    }

    public async findActiveUserByIdentifier(identifier: string): Promise<User | null> {
        const isEmail = this.isEmail(identifier);
        let user: UserMongo | null;
        if (isEmail) {
            user = await this.userModel.findOne({ email: identifier, deletedAt: {$exists: false}}).exec();
        } else {
            user = await this.userModel.findOne({ _id: identifier, deletedAt: {$exists: false}}).exec();
        }
        return user && this.fromMongo(user);
    }

    public async createUser(user: Partial<User>): Promise<User> {
        try {
            const id = await this.nextGeneratedId();
            const createdUser = new this.userModel({
                ...user,
                _id: id,
            });
            const userCreated = await createdUser.save();
            return this.fromMongo(userCreated);
        } catch (error) {
            throw new BadRequestException(...this.errorManager(error));
        }
    }

    public async updateUser(id: string, user: Partial<User>): Promise<User | null> {
        try {
            const res = await this.userModel.findByIdAndUpdate(id, convertToMongoUpdate(user), {new: true}).exec();
            return res && this.fromMongo(res);
        } catch (error) {
            throw new BadRequestException(...this.errorManager(error));
        }
    }

    public async countUsers(query: object): Promise<number> {
        return this.userModel.count(query).exec();
    }

    public async findAll(query: object, options: { limit?: number, fields?: object, skip?: number, sort?: object }): Promise<User[]> {
        const users = await this.userModel
            .find(query, options.fields)
            .limit(options.limit || 1000)
            .skip(options.skip || 0)
            .sort(options.sort).exec();
        return users.map(this.fromMongo);
    }

    // this test is simple enough to identify between an email and our id, it is not meant for validation purposes
    private isEmail(identifier: string): boolean {
        if (!identifier) { return false; }

        return identifier.indexOf('@') > -1;
    }

    private fromMongo(data: UserMongo): User {
        const {__v, _id,  ...obj} = data.toObject();
        return {
            ...obj,
            id: `${_id}`,
        };
    }

    private async nextGeneratedId(): Promise<string> {
        const id = generateId('users');
        const existing = await this.userModel.findById(id).exec();

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
