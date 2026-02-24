export interface TasksPerWeek {
    week: string;
    completed_count: number;
}

export interface TopUser {
    id: string;
    name: string;
    email: string;
    task_count: number;
    rank: number;
}

export interface AvgCompletion {
    avg_hours: number;
    min_hours: number;
    max_hours: number;
    completed_count: number;
}
