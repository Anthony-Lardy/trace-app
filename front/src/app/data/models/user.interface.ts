export interface UserHttp {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    courses: string[];
    createdAt?: string;
    createdBy?: string;
    updatedAt?: string;
    updatedBy?: string;
}

export interface User {
    courses: string[];
    id: string;
    email: string;
    fullName: string;
    firstName: string;
    lastName: string;
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    updatedBy: string;
}

export interface UserCreation {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
}
