import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AutoArchiveHandler {
    private readonly logger = new Logger(AutoArchiveHandler.name);

    constructor(private prisma: PrismaService) { }

    async handle(organizationId: string, _payload: any) {
        this.logger.log(`Auto-archiving completed tasks for org: ${organizationId}`);

        // Archive tasks completed more than 30 days ago
        const result = await this.prisma.task.updateMany({
            where: {
                organizationId,
                status: 'COMPLETED',
                completedAt: {
                    lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                },
            },
            data: { status: 'ARCHIVED' },
        });

        this.logger.log(`Archived ${result.count} tasks for org: ${organizationId}`);
        return { archivedCount: result.count };
    }
}
