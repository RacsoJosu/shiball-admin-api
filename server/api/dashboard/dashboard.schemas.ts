// dashboard.schema.ts
import { z } from 'zod';

export const inputDashboardCreateSchema = z.object({
  id: z.string(),
});
