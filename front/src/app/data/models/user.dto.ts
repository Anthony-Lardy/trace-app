import { UserHttp, User } from './user.interface';

export function toUser(user: Partial<UserHttp>): User {
    return {
        id: user.id || '',
        fullName: user.firstName + ' ' + user.lastName || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        courses: user.courses || [],
        createdAt: user.createdAt && new Date(user.createdAt) || new Date(),
        createdBy: user.createdBy || '',
        updatedBy: user.updatedBy || '',
        updatedAt: user.updatedAt && new Date(user.updatedAt) || new Date(),
    };
}

export function fromUser(user: Partial<User>): UserHttp {
    return {
        id: user.id || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        courses: user.courses || [],
    };
}
