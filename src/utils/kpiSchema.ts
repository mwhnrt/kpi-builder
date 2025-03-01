import { z } from 'zod';

export const KPISchema = z.object({
  name: z.string().min(1),
  conditioning: z.string().min(1),
  aggregationType: z.enum(['median', 'average', 'integration', 'sum']),
});
