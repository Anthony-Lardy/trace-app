export interface Course {
    id: string;
    name: string;
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    updatedBy: string;
    deletedAt?: Date;
    deletedBy?: string;
}