
import { z } from 'zod'

export const registerUserSchema = z.object({
    email: z.string().email({message: "El valor ingresado no es un email"}),
    password: z.string().min(8, { message: "debe tener un mínimo de 8 caracteres"}).max(16, { message: "debe tener un máximo de 16 caracteres"}),
    firstName: z.string().min(2 ,{ message: "debe tener un mínimo de 2 caracteres"}),
    lastName: z.string().min(2, { message: "debe tener un mínimo de 2 caracteres"}),
    birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "el valor debe estar el siguiente formato AAAA-DD-MM"}),
})


export const createUserSquemaRepository = registerUserSchema.and(z.object({
    secretKey: z.string()
}))


export const loginUserSchema = z.object({
    email: z.string().email({message: "El valor ingresado no es un email"}),
    password: z.string().min(6),
})
