export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        hasNextPage: boolean;
        nextCursor: string | null;
        total?: number;
    };
}
