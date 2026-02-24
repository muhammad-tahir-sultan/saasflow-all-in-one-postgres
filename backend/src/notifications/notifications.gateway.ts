import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    ConnectedSocket,
    MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
    cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
        credentials: true,
    },
    namespace: '/notifications',
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server!: Server;

    private readonly logger = new Logger(NotificationsGateway.name);

    handleConnection(client: Socket) {
        this.logger.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('join_organization')
    handleJoinOrg(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { organizationId: string },
    ) {
        const room = `org:${data.organizationId}`;
        client.join(room);
        this.logger.log(`Client ${client.id} joined room: ${room}`);
        return { event: 'joined', room };
    }

    @SubscribeMessage('leave_organization')
    handleLeaveOrg(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { organizationId: string },
    ) {
        const room = `org:${data.organizationId}`;
        client.leave(room);
        this.logger.log(`Client ${client.id} left room: ${room}`);
        return { event: 'left', room };
    }
}
