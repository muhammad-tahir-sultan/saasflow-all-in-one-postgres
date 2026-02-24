import Link from 'next/link';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { TaskStatusBadge } from './TaskStatusBadge';
import { formatRelativeTime } from '@/lib/utils';
import type { Task } from '@/types/task.types';

const priorityConfig: Record<string, { variant: 'default' | 'success' | 'warning' | 'danger'; label: string }> = {
    low: { variant: 'default', label: 'Low' },
    medium: { variant: 'warning', label: 'Medium' },
    high: { variant: 'danger', label: 'High' },
    critical: { variant: 'danger', label: 'Critical' },
};

export function TaskCard({ task }: { task: Task }) {
    const priority = task.metadata?.priority
        ? priorityConfig[task.metadata.priority]
        : null;

    return (
        <Link href={`/tasks/${task.id}`}>
            <Card hover className="group">
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-semibold text-surface-900 group-hover:text-brand-600 transition-colors truncate">
                            {task.title}
                        </h3>
                        {task.description && (
                            <p className="text-xs text-surface-500 mt-1 line-clamp-2">
                                {task.description}
                            </p>
                        )}
                        <div className="flex items-center gap-2 mt-3 flex-wrap">
                            <TaskStatusBadge status={task.status} />
                            {priority && (
                                <Badge variant={priority.variant} size="sm">
                                    {priority.label}
                                </Badge>
                            )}
                            {task.metadata?.labels?.map((label) => (
                                <Badge key={label} variant="purple" size="sm">
                                    {label}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <div className="text-right shrink-0">
                        <p className="text-xs text-surface-400">
                            {formatRelativeTime(task.createdAt)}
                        </p>
                        {task.assignee && (
                            <div className="mt-2 flex items-center gap-1.5 justify-end">
                                <div className="w-5 h-5 rounded-full bg-surface-200 flex items-center justify-center text-[8px] font-bold text-surface-600">
                                    {task.assignee.name.charAt(0)}
                                </div>
                                <span className="text-xs text-surface-500">{task.assignee.name.split(' ')[0]}</span>
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        </Link>
    );
}
