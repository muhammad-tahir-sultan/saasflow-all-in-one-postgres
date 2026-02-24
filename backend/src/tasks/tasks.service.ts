import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TasksRepository } from './tasks.repository';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStatus } from '@prisma/client';

@Injectable()
export class TasksService {
    private readonly logger = new Logger(TasksService.name);

    constructor(
        private prisma: PrismaService,
        private tasksRepository: TasksRepository,
    ) { }

    async create(organizationId: string, creatorId: string, dto: CreateTaskDto) {
        const task = await this.prisma.task.create({
            data: {
                organizationId,
                creatorId,
                title: dto.title,
                description: dto.description,
                assigneeId: dto.assigneeId,
                metadata: (dto.metadata as any) || {},
            },
            include: {
                assignee: { select: { id: true, name: true, email: true } },
                creator: { select: { id: true, name: true, email: true } },
            },
        });

        this.logger.log(`Task created: ${task.id} - ${task.title}`);
        return task;
    }

    async findById(id: string, organizationId: string) {
        const task = await this.prisma.task.findFirst({
            where: { id, organizationId },
            include: {
                assignee: { select: { id: true, name: true, email: true } },
                creator: { select: { id: true, name: true, email: true } },
            },
        });

        if (!task) throw new NotFoundException('Task not found');
        return task;
    }

    async update(id: string, organizationId: string, dto: UpdateTaskDto) {
        const existing = await this.prisma.task.findFirst({
            where: { id, organizationId },
        });

        if (!existing) throw new NotFoundException('Task not found');

        // Set completedAt when status changes to COMPLETED
        const completedAt =
            dto.status === TaskStatus.COMPLETED && existing.status !== TaskStatus.COMPLETED
                ? new Date()
                : dto.status !== TaskStatus.COMPLETED
                    ? null
                    : undefined;

        const task = await this.prisma.task.update({
            where: { id },
            data: {
                ...dto,
                ...(completedAt !== undefined && { completedAt }),
            } as any,
            include: {
                assignee: { select: { id: true, name: true, email: true } },
                creator: { select: { id: true, name: true, email: true } },
            },
        });

        this.logger.log(`Task updated: ${task.id}`);
        return task;
    }

    async delete(id: string, organizationId: string) {
        const existing = await this.prisma.task.findFirst({
            where: { id, organizationId },
        });

        if (!existing) throw new NotFoundException('Task not found');

        await this.prisma.task.delete({ where: { id } });
        return { message: 'Task deleted' };
    }

    async list(organizationId: string, cursor?: string, limit?: number) {
        return this.tasksRepository.listWithCursor(organizationId, cursor, limit);
    }

    async search(organizationId: string, query: string, limit?: number) {
        return this.tasksRepository.searchTasks(organizationId, query, limit);
    }

    async filterByMetadata(organizationId: string, filter: Record<string, unknown>) {
        return this.tasksRepository.filterByMetadata(organizationId, filter);
    }
}
