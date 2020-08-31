import { GroupHttp, Group } from './group.interface';

export function toGroup(group: Partial<GroupHttp>): Group {
    return {
        id: group.id || '',
        name: group.name || '',
        createdAt: group.createdAt && new Date(group.createdAt) || new Date(),
        createdBy: group.createdBy || '',
        updatedBy: group.updatedBy || '',
        updatedAt: group.updatedAt && new Date(group.updatedAt) || new Date(),
        course: group.course
    };
}

export function fromGroup(group: Partial<Group>): GroupHttp {
    return {
        id: group.id || '',
        name: group.name || '',
        course: group.course
    };
}
