export interface FilterParams {
    filter?: string;
    limit?: number;
    fields?: string | {
        paths: string[];
    };
    sort?: string;
    page?: number;
}
