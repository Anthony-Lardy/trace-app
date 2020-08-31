import { ActivityHttp, Activity } from './activity.interface';

export function toActivity(activity: Partial<ActivityHttp>): Activity {
    return {
        id: activity.id || '',
        name: activity.name || '',
        createdAt: activity.createdAt && new Date(activity.createdAt) || new Date(),
        createdBy: activity.createdBy || '',
        updatedBy: activity.updatedBy || '',
        updatedAt: activity.updatedAt && new Date(activity.updatedAt) || new Date(),
        course: activity.course,
        type: activity.type || 'unknow',
    };
}

export function fromGroup(activity: Partial<Activity>): ActivityHttp {
    return {
        id: activity.id || '',
        name: activity.name || '',
        course: activity.course,
        type: activity.type || 'unknow',
    };
}
