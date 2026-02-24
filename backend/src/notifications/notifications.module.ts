import { Module } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationsService } from './notifications.service';
import { PgListenerService } from './pg-listener.service';

@Module({
    providers: [NotificationsGateway, NotificationsService, PgListenerService],
    exports: [NotificationsService],
})
export class NotificationsModule { }
