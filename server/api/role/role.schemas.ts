// role.schema.ts
import { z } from 'zod';

export const inputRoleCreateSchema = z.object({
  name: z.string(),
  description: z.string(),
});
