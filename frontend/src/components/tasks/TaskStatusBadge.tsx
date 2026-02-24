import { Badge } from '../ui/Badge';
import type { TaskStatus } from '@/types/task.types';

const statusConfig: Record<TaskStatus, { label: string; variant: 'default' | 'success' | 'warning' | 'info' | 'purple' }> = {
    PENDING: { label: 'Pending', variant: 'default' },
    IN_PROGRESS: { label: 'In Progress', variant: 'info' },
    COMPLETED: { label: 'Completed', variant: 'success' },
    ARCHIVED: { label: 'Archived', variant: 'purple' },
};

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
}
