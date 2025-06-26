// properties.schema.ts
import { z } from 'zod';

export const inputPropertiesCreateSchema = z.object({
  id: z.string(),
  description: z.string(),
  capacity: z.coerce.number().int().nullable(),
  fkIdUSer: z.string(),
  type: z.enum(['DWELLING', 'VEHICLE']),
});
