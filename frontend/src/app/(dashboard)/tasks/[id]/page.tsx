'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTask, useUpdateTask, useDeleteTask } from '@/hooks/useTasks';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { TaskStatusBadge } from '@/components/tasks/TaskStatusBadge';
import { ConfirmDeleteModal } from '@/components/tasks/ConfirmDeleteModal';
import { toast } from '@/components/ui/Toast';
import { formatDate, formatRelativeTime } from '@/lib/utils';
import type { TaskStatus } from '@/types/task.types';

const statusOptions: TaskStatus[] = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'ARCHIVED'];

export default function TaskDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { isAdmin } = useAuth();
    const { data: task, isLoading } = useTask(params.id as string);
    const updateTask = useUpdateTask();
    const deleteTask = useDeleteTask();
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    if (isLoading) {
        return (
            <div className="flex justify-center py-20">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!task) {
        return (
            <div className="text-center py-20">
                <h2 className="text-lg font-semibold text-surface-900">Task not found</h2>
            </div>
        );
    }

    const handleStatusChange = async (status: TaskStatus) => {
        try {
            await updateTask.mutateAsync({ id: task.id, status });
            toast('success', `Status updated to ${status}`);
        } catch {
            toast('error', 'Failed to update status');
        }
    };

    const handleDelete = async () => {
        try {
            await deleteTask.mutateAsync(task.id);
            toast('success', 'Task deleted');
            router.push('/tasks');
        } catch {
            toast('error', 'Failed to delete task');
        }
    };

    const priority = task.metadata?.priority;
    const priorityColors: Record<string, string> = {
        low: 'default',
        medium: 'warning',
        high: 'danger',
        critical: 'danger',
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
            {/* Back Button */}
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-sm text-surface-500 hover:text-surface-700 transition-colors"
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Tasks
            </button>

            {/* Main Card */}
            <Card>
                <div className="space-y-6">
                    {/* Title & Status */}
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h1 className="text-xl font-bold text-surface-900">{task.title}</h1>
                            <p className="text-xs text-surface-400 mt-1">
                                Created {formatDate(task.createdAt)} · {formatRelativeTime(task.createdAt)}
                            </p>
                        </div>
                        <TaskStatusBadge status={task.status} />
                    </div>

                    {/* Description */}
                    {task.description && (
                        <div>
                            <h3 className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2">
                                Description
                            </h3>
                            <p className="text-sm text-surface-700 leading-relaxed whitespace-pre-wrap">
                                {task.description}
                            </p>
                        </div>
                    )}

                    {/* Metadata */}
                    <div className="flex flex-wrap gap-2">
                        {priority && (
                            <Badge variant={priorityColors[priority] as any}>
                                Priority: {priority}
                            </Badge>
                        )}
                        {task.metadata?.labels?.map((label: string) => (
                            <Badge key={label} variant="purple">{label}</Badge>
                        ))}
                    </div>

                    {/* People */}
                    <div className="grid grid-cols-2 gap-4">
                        {task.creator && (
                            <div>
                                <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-1">Creator</p>
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold">
                                        {task.creator.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-surface-900">{task.creator.name}</p>
                                        <p className="text-xs text-surface-500">{task.creator.email}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        {task.assignee && (
                            <div>
                                <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-1">Assignee</p>
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">
                                        {task.assignee.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-surface-900">{task.assignee.name}</p>
                                        <p className="text-xs text-surface-500">{task.assignee.email}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="border-t border-surface-100 pt-4">
                        <h3 className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-3">
                            Update Status
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {statusOptions.map((s) => (
                                <Button
                                    key={s}
                                    variant={task.status === s ? 'primary' : 'secondary'}
                                    size="sm"
                                    onClick={() => handleStatusChange(s)}
                                    isLoading={updateTask.isPending}
                                >
                                    {s.replace('_', ' ')}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Delete */}
                    {isAdmin && (
                        <div className="border-t border-surface-100 pt-4">
                            <Button variant="danger" size="sm" onClick={() => setShowDeleteModal(true)}>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete Task
                            </Button>
                        </div>
                    )}
                </div>
            </Card>

            {/* JSONB Debug */}
            <Card className="bg-surface-900 text-white border-0">
                <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">
                    JSONB Metadata (PostgreSQL)
                </h3>
                <pre className="text-xs text-surface-300 overflow-x-auto">
                    {JSON.stringify(task.metadata, null, 2)}
                </pre>
            </Card>

            {/* Delete Confirmation Portal Modal */}
            <ConfirmDeleteModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                isLoading={deleteTask.isPending}
                taskTitle={task.title}
            />
        </div>
    );
}
