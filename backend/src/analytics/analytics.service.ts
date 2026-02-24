import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(private prisma: PrismaService) { }

  /**
   * Tasks completed per week (last 12 weeks).
   * Uses DATE_TRUNC for weekly bucketing.
   */
  async tasksPerWeek(organizationId: string) {
    return this.prisma.$queryRaw`
      SELECT
        DATE_TRUNC('week', completed_at) AS week,
        COUNT(*)::int AS completed_count
      FROM tasks
      WHERE organization_id = CAST(${organizationId} AS uuid)
        AND status = 'COMPLETED'::"TaskStatus"
        AND completed_at >= NOW() - INTERVAL '12 weeks'
      GROUP BY week
      ORDER BY week ASC
    `;
  }

  /**
   * Most active users — uses CTE + RANK() window function.
   */
  async topUsers(organizationId: string) {
    return this.prisma.$queryRaw`
      WITH user_counts AS (
        SELECT
          assignee_id,
          COUNT(*)::int AS task_count,
          RANK() OVER (ORDER BY COUNT(*) DESC) AS rank
        FROM tasks
        WHERE organization_id = CAST(${organizationId} AS uuid)
          AND status = 'COMPLETED'::"TaskStatus"
          AND assignee_id IS NOT NULL
        GROUP BY assignee_id
      )
      SELECT u.id, u.name, u.email, uc.task_count, uc.rank::int
      FROM user_counts uc
      JOIN users u ON u.id = uc.assignee_id
      ORDER BY rank
      LIMIT 10
    `;
  }

  /**
   * Average completion time in hours.
   */
  async avgCompletionTime(organizationId: string) {
    const result: any[] = await this.prisma.$queryRaw`
      SELECT
        ROUND(AVG(EXTRACT(EPOCH FROM (completed_at - created_at)) / 3600)::numeric, 2) AS avg_hours,
        ROUND(MIN(EXTRACT(EPOCH FROM (completed_at - created_at)) / 3600)::numeric, 2) AS min_hours,
        ROUND(MAX(EXTRACT(EPOCH FROM (completed_at - created_at)) / 3600)::numeric, 2) AS max_hours,
        COUNT(*)::int AS completed_count
      FROM tasks
      WHERE organization_id = CAST(${organizationId} AS uuid)
        AND status = 'COMPLETED'::"TaskStatus"
        AND completed_at IS NOT NULL
    `;

    return result[0] || { avg_hours: 0, min_hours: 0, max_hours: 0, completed_count: 0 };
  }
}
