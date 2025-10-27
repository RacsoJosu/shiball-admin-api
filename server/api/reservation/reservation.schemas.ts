// reservation.schema.ts
import { z } from 'zod';

export const inputReservationCreateSchema = z.object({
  id: z.string(),
});
