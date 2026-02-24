import { Injectable, Logger } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';

export interface TaskEvent {
    event: string;
    task_id: string;
    organization_id: string;
    title: string;
    status?: string;
}

@Injectable()
export class NotificationsService {
    private readonly logger = new Logger(NotificationsService.name);

    constructor(private gateway: NotificationsGateway) { }

    broadcast(payload: TaskEvent) {
        // Emit to organization-specific room
        const room = `org:${payload.organization_id}`;
        this.gateway.server.to(room).emit('task_event', {
            event: payload.event,
            taskId: payload.task_id,
            title: payload.title,
            status: payload.status,
            timestamp: new Date().toISOString(),
        });

        this.logger.debug(`Broadcast to ${room}: ${payload.event}`);
    }
}
