'use client';

import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { TaskForm } from '@/components/tasks/TaskForm';

export default function NewTaskPage() {
    const router = useRouter();

    return (
        <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold text-surface-900">Create New Task</h1>
                <p className="text-sm text-surface-500 mt-1">Add a task with JSONB metadata</p>
            </div>

            <Card>
                <TaskForm onSuccess={() => router.push('/tasks')} />
            </Card>
        </div>
    );
}
