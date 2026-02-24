import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { Client } from 'pg';
import { NotificationsService } from './notifications.service';

@Injectable()
export class PgListenerService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(PgListenerService.name);
    private client: Client;

    constructor(private notificationsService: NotificationsService) {
        this.client = new Client({
            connectionString: process.env.DATABASE_URL,
        });
    }

    async onModuleInit() {
        try {
            await this.client.connect();
            this.logger.log('PG Listener connected');

            // Listen for task events
            await this.client.query('LISTEN task_events');
            this.logger.log('Listening on channel: task_events');

            this.client.on('notification', (msg) => {
                if (msg.channel === 'task_events' && msg.payload) {
                    try {
                        const payload = JSON.parse(msg.payload);
                        this.logger.debug(`Task event received: ${payload.event} - ${payload.task_id}`);
                        this.notificationsService.broadcast(payload);
                    } catch (error) {
                        this.logger.error('Failed to parse notification payload', error);
                    }
                }
            });

            this.client.on('error', (err) => {
                this.logger.error('PG Listener error', err);
            });
        } catch (error) {
            this.logger.error('Failed to connect PG Listener', error);
        }
    }

    async onModuleDestroy() {
        try {
            await this.client.end();
            this.logger.log('PG Listener disconnected');
        } catch (error) {
            this.logger.error('Error disconnecting PG Listener', error);
        }
    }
}
