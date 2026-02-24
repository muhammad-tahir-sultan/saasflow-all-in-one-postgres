import { z } from 'zod';

export const createJobSchema = z.object({
    type: z.enum(['weekly_summary', 'auto_archive']),
    payload: z.record(z.unknown()).optional(),
    scheduledAt: z.string().datetime().optional(),
});

export type CreateJobDto = z.infer<typeof createJobSchema>;
