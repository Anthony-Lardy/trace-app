export type TraceAction = 'send-email' | 'unknow';
export type TraceSource = 'moodle' | 'unknow';

export interface Trace {
    id: string;
    action: TraceAction;
    source: TraceSource;
    payload: string;
    student: string;
    activity: string;
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    updatedBy: string;
    deletedAt?: Date;
    deletedBy?: string;
}