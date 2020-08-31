export type ActivityType = 'quizz' | 'unknow';

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