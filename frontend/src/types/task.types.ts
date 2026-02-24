export interface Task {
    id: string;
    organizationId: string;
    title: string;
    description: string | null;
    status: TaskStatus;
    assigneeId: string | null;
    creatorId: string;
    metadata: TaskMetadata;
    completedAt: string | null;
    createdAt: string;
    updatedAt: string;
    assignee?: UserSummary | null;
    creator?: UserSummary;
}

export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'ARCHIVED';

export interface TaskMetadata {
    priority?: 'low' | 'medium' | 'high' | 'critical';
    labels?: string[];
    customFields?: Record<string, string | number | boolean>;
    dueDate?: string;
}

export interface CreateTaskInput {
    title: string;
    description?: string;
    assigneeId?: string;
    metadata?: TaskMetadata;
}

export interface UpdateTaskInput {
    title?: string;
    description?: string;
    status?: TaskStatus;
    assigneeId?: string | null;
    metadata?: Partial<TaskMetadata>;
}

export interface UserSummary {
    id: string;
    name: string;
    email: string;
}

export interface PaginatedTasks {
    data: Task[];
    meta: {
        hasNextPage: boolean;
        nextCursor: string | null;
    };
}
