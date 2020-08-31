export type ActivityType = 'quizz' | 'unknow';

export interface ActivityHttp {
    id: string;
    name: string;
    createdAt?: string;
    createdBy?: string;
    updatedAt?: string;
    updatedBy?: string;
    deletedAt?: string;
    deletedBy?: string;
    course: string;
    type: ActivityType;
}

export interface Activity {
    id: string;
    name: string;
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    updatedBy: string;
    deletedAt?: Date;
    deletedBy?: string;
    course: string;
    type: ActivityType;
}
