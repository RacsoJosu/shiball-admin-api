import { registerUserSchema } from '../../auth/auth.schemas';

export const updateUserInput = registerUserSchema.partial();
