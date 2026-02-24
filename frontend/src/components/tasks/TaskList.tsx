'use client';

import { useTasksList } from '@/hooks/useTasks';
import { TaskCard } from './TaskCard';
import { Spinner } from '../ui/Spinner';
import { Button } from '../ui/Button';

export function TaskList() {
    const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useTasksList();

    if (isLoading) {
        return (
            <div className="flex justify-center py-20">
                <Spinner size="lg" />
            </div>
        );
    }

    const tasks = data?.pages.flatMap((page) => page.data) || [];

    if (tasks.length === 0) {
        return (
            <div className="text-center py-20">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-surface-100 flex items-center justify-center">
                    <svg className="w-8 h-8 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-surface-900">No tasks yet</h3>
                <p className="text-sm text-surface-500 mt-1">Create your first task to get started</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
            ))}

            {hasNextPage && (
                <div className="flex justify-center pt-4">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => fetchNextPage()}
                        isLoading={isFetchingNextPage}
                    >
                        Load More
                    </Button>
                </div>
            )}
        </div>
    );
}
