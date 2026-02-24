import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WeeklySummaryHandler } from './handlers/weekly-summary.handler';
import { AutoArchiveHandler } from './handlers/auto-archive.handler';

interface JobRecord {
    id: string;
    type: string;
    payload: any;
    organization_id: string;
    attempts: number;
    max_attempts: number;
}

@Injectable()
export class JobsWorker implements OnModuleInit {
    private readonly logger = new Logger(JobsWorker.name);
    private readonly POLL_INTERVAL = 10_000; // 10 seconds

    constructor(
        private prisma: PrismaService,
        private weeklySummaryHandler: WeeklySummaryHandler,
        private autoArchiveHandler: AutoArchiveHandler,
    ) { }

    onModuleInit() {
        this.logger.log('Job worker started — polling every 10 seconds');
        setInterval(() => this.processNextJob(), this.POLL_INTERVAL);
    }

    async processNextJob() {
        try {
            // Atomic claim using FOR UPDATE SKIP LOCKED (prevents double-processing)
            const jobs: JobRecord[] = await this.prisma.$queryRaw`
        UPDATE jobs
        SET status = 'PROCESSING', started_at = NOW(), attempts = attempts + 1
        WHERE id = (
          SELECT id FROM jobs
          WHERE status = 'PENDING'
            AND scheduled_at <= NOW()
            AND attempts < max_attempts
          ORDER BY scheduled_at ASC
          FOR UPDATE SKIP LOCKED
          LIMIT 1
        )
        RETURNING *
      `;

            if (!jobs || jobs.length === 0) return;

            const job = jobs[0];
            this.logger.log(`Processing job: ${job.id} (${job.type})`);

            try {
                await this.dispatch(job);

                await this.prisma.job.update({
                    where: { id: job.id },
                    data: { status: 'COMPLETED', completedAt: new Date() },
                });

                this.logger.log(`Job completed: ${job.id}`);
            } catch (error) {
                const message = error instanceof Error ? error.message : 'Unknown error';
                const shouldRetry = job.attempts < job.max_attempts;

                await this.prisma.job.update({
                    where: { id: job.id },
                    data: {
                        status: shouldRetry ? 'PENDING' : 'FAILED',
                        error: message,
                    },
                });

                this.logger.error(
                    `Job ${shouldRetry ? 'will retry' : 'failed'}: ${job.id} — ${message}`,
                );
            }
        } catch (error) {
            this.logger.error('Worker polling error', error);
        }
    }

    private async dispatch(job: JobRecord) {
        switch (job.type) {
            case 'weekly_summary':
                return this.weeklySummaryHandler.handle(job.organization_id, job.payload);
            case 'auto_archive':
                return this.autoArchiveHandler.handle(job.organization_id, job.payload);
            default:
                throw new Error(`Unknown job type: ${job.type}`);
        }
    }
}
