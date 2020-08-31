export interface StudentHttp {
    id: string;
    firstName: string;
    lastName: string;
    createdAt?: string;
    createdBy?: string;
    updatedAt?: string;
    updatedBy?: string;
    courses: string[];
}

export interface Student {
    id: string;
    firstName: string;
    lastName: string;
    createdAt?: Date;
    createdBy?: string;
    updatedAt?: Date;
    updatedBy?: string;
    courses: string[];
}
