export interface User {
    id: string;
    email: string;
    lastName: string;
    firstName: string;
    password?: string;
    courses: string[];
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    updatedBy: string;
    deletedAt?: Date;
    deletedBy?: string;
}