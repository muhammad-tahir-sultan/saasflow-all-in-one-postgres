import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TasksRepository {
  constructor(private prisma: PrismaService) { }

  /**
   * Full-text search using tsvector + plainto_tsquery
   * Replaces Elasticsearch with native PostgreSQL FTS
   */
  async searchTasks(organizationId: string, query: string, limit: number = 20) {
    return this.prisma.$queryRaw`
      SELECT id, title, description, status, metadata, created_at as "createdAt",
             assignee_id as "assigneeId", creator_id as "creatorId",
             ts_rank(search_vector, plainto_tsquery('english', ${query})) as rank
      FROM tasks
      WHERE organization_id = CAST(${organizationId} AS uuid)
        AND search_vector @@ plainto_tsquery('english', ${query})
      ORDER BY rank DESC
      LIMIT ${limit}
    `;
  }

  /**
   * JSONB containment filter using @> operator
   * Replaces MongoDB-style document queries
   */
  async filterByMetadata(organizationId: string, filter: Record<string, unknown>) {
    const filterJson = JSON.stringify(filter);
    return this.prisma.$queryRaw`
      SELECT id, title, description, status, metadata, created_at as "createdAt",
             assignee_id as "assigneeId", creator_id as "creatorId"
      FROM tasks
      WHERE organization_id = CAST(${organizationId} AS uuid)
        AND metadata @> ${filterJson}::jsonb
      ORDER BY created_at DESC
    `;
  }

  /**
   * Cursor-based pagination for optimal performance at scale.
   * Uses composite (createdAt, id) cursor for deterministic ordering.
   */
  async listWithCursor(
    organizationId: string,
    cursor?: string,
    limit: number = 20,
  ) {
    const tasks = await this.prisma.task.findMany({
      where: { organizationId },
      take: limit + 1,
      ...(cursor && {
        skip: 1,
        cursor: { id: cursor },
      }),
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      include: {
        assignee: { select: { id: true, name: true, email: true } },
        creator: { select: { id: true, name: true, email: true } },
      },
    });

    const hasNextPage = tasks.length > limit;
    const data = hasNextPage ? tasks.slice(0, limit) : tasks;
    const nextCursor = hasNextPage ? data[data.length - 1].id : null;

    return {
      data,
      meta: { hasNextPage, nextCursor },
    };
  }
}
