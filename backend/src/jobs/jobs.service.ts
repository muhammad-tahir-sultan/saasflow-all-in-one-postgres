import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobDto } from './dto/create-job.dto';

@Injectable()
export class JobsService {
    private readonly logger = new Logger(JobsService.name);

    constructor(private prisma: PrismaService) { }

    async enqueue(organizationId: string, dto: CreateJobDto) {
        const job = await this.prisma.job.create({
            data: {
                organizationId,
                type: dto.type,
                payload: (dto.payload as any) || {},
                scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : new Date(),
            },
        });

        this.logger.log(`Job enqueued: ${job.id} (${job.type})`);
        return job;
    }

    async list(organizationId: string) {
        return this.prisma.job.findMany({
            where: { organizationId },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });
    }

    async updateStatus(id: string, status: string, error?: string) {
        return this.prisma.job.update({
            where: { id },
            data: {
                status: status as any,
                ...(status === 'COMPLETED' && { completedAt: new Date() }),
                ...(error && { error }),
            },
        });
    }
}
