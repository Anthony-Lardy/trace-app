export interface GroupHttp {
    id: string;
    name: string;
    createdAt?: string;
    createdBy?: string;
    updatedAt?: string;
    updatedBy?: string;
    course: string;
}

export interface Group {
    id: string;
    name: string;
    createdAt?: Date;
    createdBy?: string;
    updatedAt?: Date;
    updatedBy?: string;
    course: string;
}
