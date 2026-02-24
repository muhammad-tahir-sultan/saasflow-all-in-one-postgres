'use client';

import { useEffect } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useOrganization } from '@/hooks/useOrganization';
import { toast } from '../ui/Toast';

export function NotificationBell() {
    const { activeOrg } = useOrganization();
    const { lastEvent, isConnected, clearLastEvent } = useWebSocket(activeOrg?.id);

    useEffect(() => {
        if (lastEvent) {
            const eventNames: Record<string, string> = {
                INSERT: 'created',
                UPDATE: 'updated',
                DELETE: 'deleted',
            };
            const action = eventNames[lastEvent.event] || lastEvent.event;
            toast('info', `Task "${lastEvent.title}" was ${action}`);
            clearLastEvent();
        }
    }, [lastEvent, clearLastEvent]);

    return (
        <button className="relative p-2 rounded-lg text-surface-500 hover:text-surface-700 hover:bg-surface-100 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {isConnected && (
                <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
            )}
        </button>
    );
}
