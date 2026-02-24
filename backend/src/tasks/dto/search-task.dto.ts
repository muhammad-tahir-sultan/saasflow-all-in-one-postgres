import { z } from 'zod';

export const searchTaskSchema = z.object({
    q: z.string().min(1, 'Search query is required'),
    limit: z.coerce.number().int().min(1).max(50).default(20),
});

export type SearchTaskDto = z.infer<typeof searchTaskSchema>;
