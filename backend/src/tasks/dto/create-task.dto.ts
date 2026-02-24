import { z } from 'zod';

const metadataSchema = z.object({
    priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
    labels: z.array(z.string()).optional(),
    customFields: z.record(z.union([z.string(), z.number(), z.boolean()])).optional(),
    dueDate: z.string().datetime().optional(),
}).optional();

export const createTaskSchema = z.object({
    title: z.string().min(1, 'Title is required').max(255),
    description: z.string().optional(),
    assigneeId: z.string().uuid().optional(),
    metadata: metadataSchema,
});

export type CreateTaskDto = z.infer<typeof createTaskSchema>;
