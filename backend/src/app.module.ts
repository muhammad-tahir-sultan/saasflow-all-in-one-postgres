import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { JobsModule } from './jobs/jobs.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
    imports: [
        PrismaModule,
        AuthModule,
        OrganizationsModule,
        UsersModule,
        TasksModule,
        JobsModule,
        NotificationsModule,
        AnalyticsModule,
    ],
})
export class AppModule { }
