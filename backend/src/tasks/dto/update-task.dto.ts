import { z } from 'zod';
import { TaskStatus } from '@prisma/client';

export const updateTaskSchema = z.object({
    title: z.string().min(1).max(255).optional(),
    description: z.string().optional(),
    status: z.nativeEnum(TaskStatus).optional(),
    assigneeId: z.string().uuid().nullable().optional(),
    metadata: z.record(z.unknown()).optional(),
});

export type UpdateTaskDto = z.infer<typeof updateTaskSchema>;
