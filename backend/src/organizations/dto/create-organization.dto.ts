import { z } from 'zod';

export const createOrganizationSchema = z.object({
    name: z.string().min(2, 'Organization name must be at least 2 characters'),
    slug: z.string().min(2).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with dashes').optional(),
});

export type CreateOrganizationDto = z.infer<typeof createOrganizationSchema>;
