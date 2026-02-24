import { z } from 'zod';

export const analyticsQuerySchema = z.object({
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
});

export type AnalyticsQueryDto = z.infer<typeof analyticsQuerySchema>;
