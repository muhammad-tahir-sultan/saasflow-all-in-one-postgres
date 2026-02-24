'use client';

import { useState } from 'react';
import { TaskList } from '@/components/tasks/TaskList';
import { TaskSearch } from '@/components/tasks/TaskSearch';
import { TaskForm } from '@/components/tasks/TaskForm';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { OrgSwitcher } from '@/components/layout/OrgSwitcher';

export default function TasksPage() {
    const [showCreate, setShowCreate] = useState(false);

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-surface-900">Tasks</h1>
                    <p className="text-sm text-surface-500 mt-1">
                        Full-text search powered by PostgreSQL tsvector
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <OrgSwitcher />
                    <Button onClick={() => setShowCreate(true)}>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        New Task
                    </Button>
                </div>
            </div>

            {/* Search */}
            <TaskSearch />

            {/* Task List */}
            <TaskList />

            {/* Create Modal */}
            <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create Task">
                <TaskForm onSuccess={() => setShowCreate(false)} />
            </Modal>
        </div>
    );
}
