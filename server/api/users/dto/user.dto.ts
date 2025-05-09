import z from 'zod';

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  birthDate: z.date().nullable(),
  userSecret: z.string(),
  password: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
});
export const userSafeSchema = userSchema.omit({
  deletedAt: true,
  updatedAt: true,
  createdAt: true,
});
