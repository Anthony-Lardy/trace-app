export interface Student {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    courses: string[];
    groups: string[];
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    updatedBy: string;
    deletedAt?: Date;
    deletedBy?: string;
}