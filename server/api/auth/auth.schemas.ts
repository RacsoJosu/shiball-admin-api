
import { z } from 'zod'

export const registerUserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
})


export const loginUserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
})
