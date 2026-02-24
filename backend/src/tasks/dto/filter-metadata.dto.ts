import { z } from 'zod';

export const filterMetadataSchema = z.object({
    metadata: z.string().transform((val) => {
        try {
            return JSON.parse(val);
        } catch {
            return {};
        }
    }),
});

export type FilterMetadataDto = z.infer<typeof filterMetadataSchema>;
