'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface TaskEvent {
    event: string;
    taskId: string;
    title: string;
    status?: string;
    timestamp: string;
}

export function useWebSocket(organizationId: string | null | undefined) {
    const socketRef = useRef<Socket | null>(null);
    const [lastEvent, setLastEvent] = useState<TaskEvent | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!organizationId) return;

        const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001';
        const socket = io(`${wsUrl}/notifications`, {
            transports: ['websocket'],
            autoConnect: true,
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            setIsConnected(true);
            socket.emit('join_organization', { organizationId });
        });

        socket.on('disconnect', () => {
            setIsConnected(false);
        });

        socket.on('task_event', (event: TaskEvent) => {
            setLastEvent(event);
        });

        return () => {
            socket.emit('leave_organization', { organizationId });
            socket.disconnect();
            socketRef.current = null;
        };
    }, [organizationId]);

    const clearLastEvent = useCallback(() => {
        setLastEvent(null);
    }, []);

    return { isConnected, lastEvent, clearLastEvent };
}
