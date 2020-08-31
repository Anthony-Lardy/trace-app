import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { UserSession } from '@lib/helper';
import { FilterParams } from '@lib/search-filter';
import { findKey } from 'lodash';
import { userFilter } from './user-filter';
import { User } from './user.interface';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
    ) {
    }

    public async getUser(id: string, context: UserSession, kind: 'all' | 'active' = 'active'): Promise<User> {
        const user = kind === 'all' ?
            await this.userRepository.findByIdentifier(id)
            : await this.userRepository.findActiveUserByIdentifier(id);
        if (!user) {
            throw new NotFoundException('User does not exist.');
        }
        
        return user;
    }

    public getUserAuthentification(email: string): Promise<User | null> {
        return this.userRepository.findActiveUserByIdentifier(email);
    }

    public async createUser(user: Partial<User>): Promise<User> {
        const userCreated = await this.userRepository.createUser({
            ...user,
            createdAt: new Date(),
            createdBy: user.email,
            updatedAt: new Date(),
            updatedBy: user.email,
        });

        return userCreated;
    }

    public async updateUser(id: string, user: Partial<User>, context: UserSession): Promise<User> {
       
        const userUpdated = await this.userRepository.updateUser(id, {
            ...user,
            updatedAt: new Date(),
            updatedBy: context.id,
        });

        if (!userUpdated) {
            throw new BadRequestException('User update failed.');
        }
        return userUpdated;
    }

    public async deleteUser(id: string, context: UserSession): Promise<User> {
        await this.getUser(id, context);

        const userDeleted = await this.userRepository.updateUser(id, {
            deletedAt: new Date(),
            deletedBy: context.id,
            updatedAt: new Date(),
            updatedBy: context.id,
        });

        if (!userDeleted) {
            throw new BadRequestException('User delete failed.');
        }
        return userDeleted;
    }

    public async listUsers(filter: FilterParams, context: UserSession): Promise<User[]> {
        const { query, options } = this.filterParseOrFail(filter, context);

        if (!findKey(query['$and'], 'deletedAt') && !findKey(query['$and'], 'deletedBy')) {
            query['deletedAt'] = { $exists: false };
        }

        return this.userRepository.findAll(query, options);
    }

    private filterParseOrFail(filterParams: FilterParams, context: UserSession): { query: object; options: object } {
        const {value = {query: {}, options: {}}, error} = userFilter.parse(filterParams, context);
        if (error) {
            throw new BadRequestException(error, error.title);
        }
        return { query: value.query, options: value.options };
    }

}
