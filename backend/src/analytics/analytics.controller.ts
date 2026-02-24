import { Controller, Get, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { OrganizationId } from '../common/decorators/organization.decorator';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService) { }

    @Get('tasks-per-week')
    async tasksPerWeek(@OrganizationId() orgId: string) {
        return this.analyticsService.tasksPerWeek(orgId);
    }

    @Get('top-users')
    async topUsers(@OrganizationId() orgId: string) {
        return this.analyticsService.topUsers(orgId);
    }

    @Get('avg-completion')
    async avgCompletionTime(@OrganizationId() orgId: string) {
        return this.analyticsService.avgCompletionTime(orgId);
    }
}
