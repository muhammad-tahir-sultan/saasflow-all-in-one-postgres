import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class WeeklySummaryHandler {
  private readonly logger = new Logger(WeeklySummaryHandler.name);

  constructor(private prisma: PrismaService) { }

  async handle(organizationId: string, _payload: any) {
    this.logger.log(`Generating weekly summary for org: ${organizationId}`);

    // Gather stats for the past week
    const summary: any[] = await this.prisma.$queryRaw`
      SELECT
        COUNT(*) FILTER (WHERE status = 'COMPLETED' AND completed_at >= NOW() - INTERVAL '7 days')::int as completed_this_week,
        COUNT(*) FILTER (WHERE status = 'PENDING')::int as pending_tasks,
        COUNT(*) FILTER (WHERE status = 'IN_PROGRESS')::int as in_progress_tasks,
        COUNT(*)::int as total_tasks
      FROM tasks
      WHERE organization_id::text = ${organizationId}
    `;

    this.logger.log(`Weekly summary generated: ${JSON.stringify(summary[0])}`);
    return summary[0];
  }
}
