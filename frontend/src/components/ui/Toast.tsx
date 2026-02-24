'use client';

import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface ToastMessage {
    id: string;
    type: 'success' | 'error' | 'info';
    message: string;
}

let addToast: (type: ToastMessage['type'], message: string) => void;

export function toast(type: ToastMessage['type'], message: string) {
    addToast?.(type, message);
}

export function ToastContainer() {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    addToast = useCallback((type: ToastMessage['type'], message: string) => {
        const id = Date.now().toString();
        setToasts((prev) => [...prev, { id, type, message }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4000);
    }, []);

    const icons = {
        success: (
            <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
        ),
        error: (
            <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        ),
        info: (
            <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    };

    return (
        <div className="fixed top-4 right-4 z-[100] space-y-2">
            {toasts.map((t) => (
                <div
                    key={t.id}
                    className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg backdrop-blur-md animate-slide-in-right',
                        'bg-white/95 border border-surface-200',
                    )}
                >
                    {icons[t.type]}
                    <p className="text-sm font-medium text-surface-800">{t.message}</p>
                </div>
            ))}
        </div>
    );
}
