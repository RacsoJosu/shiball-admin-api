import '../../config/zod-extend';
import { z } from 'zod';

export const registerUserSchema = z
  .object({
    email: z
      .string()
      .email({ message: 'El valor ingresado no es un email' })
      .openapi({
        example: 'usuario@shiball.com',
        description: 'Correo electrónico único del usuario',
      }),
    password: z
      .string()
      .min(8, { message: 'debe tener un mínimo de 8 caracteres' })
      .max(16, { message: 'debe tener un máximo de 16 caracteres' })
      .openapi({
        example: 'Admin123*',
        description: 'Contraseña del usuario (de 8 a 16 caracteres)',
      }),
    firstName: z
      .string()
      .min(2, { message: 'debe tener un mínimo de 2 caracteres' })
      .openapi({
        example: 'Oscar',
        description: 'Nombre del usuario',
      }),
    lastName: z
      .string()
      .min(2, { message: 'debe tener un mínimo de 2 caracteres' })
      .openapi({
        example: 'Vallecillos',
        description: 'Apellido del usuario',
      }),
    birthDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'el valor debe estar el siguiente formato AAAA-DD-MM',
      })
      .openapi({
        example: '1995-10-25',
        description: 'Fecha de nacimiento en formato AAAA-MM-DD',
      }),
  })
  .openapi('RegisterUserInput');

export const createUserSquemaRepository = registerUserSchema.and(
  z.object({
    secretKey: z.string(),
  })
);

export const loginUserSchema = z
  .object({
    email: z
      .string()
      .email({ message: 'El valor ingresado no es un email' })
      .openapi({
        example: 'usuario@shiball.com',
        description: 'Correo electrónico registrado',
      }),
    password: z
      .string()
      .min(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
      .openapi({
        example: 'Admin123*',
        description: 'Contraseña del usuario',
      }),
  })
  .openapi('LoginUserInput');
