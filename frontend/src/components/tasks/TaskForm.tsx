'use client';

import { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useCreateTask } from '@/hooks/useTasks';
import { toast } from '../ui/Toast';

interface TaskFormProps {
    onSuccess?: () => void;
}

export function TaskForm({ onSuccess }: TaskFormProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<string>('medium');
    const [labels, setLabels] = useState('');

    const createTask = useCreateTask();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await createTask.mutateAsync({
                title,
                description: description || undefined,
                metadata: {
                    priority: priority as any,
                    labels: labels
                        ? labels.split(',').map((l) => l.trim()).filter(Boolean)
                        : [],
                    customFields: {},
                },
            });
            toast('success', 'Task created successfully');
            setTitle('');
            setDescription('');
            setPriority('medium');
            setLabels('');
            onSuccess?.();
        } catch {
            toast('error', 'Failed to create task');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <Input
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title"
                required
            />

            <div className="space-y-1.5">
                <label className="block text-sm font-medium text-surface-700">
                    Description
                </label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the task..."
                    rows={3}
                    className="w-full rounded-xl border border-surface-200 bg-white px-4 py-2.5 text-sm text-surface-900 placeholder:text-surface-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all duration-200 hover:border-surface-300 resize-none"
                />
            </div>

            <div className="space-y-1.5">
                <label className="block text-sm font-medium text-surface-700">
                    Priority
                </label>
                <div className="flex gap-2">
                    {['low', 'medium', 'high', 'critical'].map((p) => (
                        <button
                            key={p}
                            type="button"
                            onClick={() => setPriority(p)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${priority === p
                                    ? 'bg-brand-600 text-white shadow-sm'
                                    : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                                }`}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            <Input
                label="Labels"
                value={labels}
                onChange={(e) => setLabels(e.target.value)}
                placeholder="backend, urgent, sprint-3..."
            />

            <Button type="submit" isLoading={createTask.isPending} className="w-full">
                Create Task
            </Button>
        </form>
    );
}
