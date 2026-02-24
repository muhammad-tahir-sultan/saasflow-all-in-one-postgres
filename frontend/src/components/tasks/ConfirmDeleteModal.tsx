'use client';

import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface ConfirmDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading?: boolean;
    taskTitle: string;
}

export function ConfirmDeleteModal({
    isOpen,
    onClose,
    onConfirm,
    isLoading,
    taskTitle,
}: ConfirmDeleteModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Delete Task" size="sm">
            <div className="space-y-5">
                {/* Warning Icon */}
                <div className="flex justify-center">
                    <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
                        <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                            />
                        </svg>
                    </div>
                </div>

                {/* Message */}
                <div className="text-center">
                    <p className="text-sm text-surface-600">
                        Are you sure you want to delete this task?
                    </p>
                    <p className="mt-2 text-sm font-semibold text-surface-900 px-4 py-2 bg-surface-50 rounded-lg truncate">
                        &ldquo;{taskTitle}&rdquo;
                    </p>
                    <p className="mt-3 text-xs text-surface-400">
                        This action cannot be undone.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <Button
                        variant="secondary"
                        className="flex-1"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="danger"
                        className="flex-1"
                        onClick={onConfirm}
                        isLoading={isLoading}
                    >
                        Delete
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
