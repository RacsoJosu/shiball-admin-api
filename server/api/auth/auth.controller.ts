import { Request, Response } from 'express';
import { createUser, findUserByEmail } from './auth.service';
import { ApiError } from '../../middlewares/statusCode';
import { comparePasswordAsync } from '../../shared/libs/bcrypt';
import z from 'zod';
import { loginUserSchema } from './auth.schemas';
import { signJwtUser } from '../../shared/libs/jwt';

export async function postResgisterUser(req: Request, res: Response) {
  const { body: values } = req;

  const user = await findUserByEmail(values.email);

  if (user) {
    throw new ApiError({
      title: 'El usuario ya existe',
      details: `El usuario con email ${values.email} ya existe`,
      statusCode: 400,
      success: false,
    });
  }

  const userResgister = await createUser(values);

  res.status(200).json({
    message: 'Usuario creado',
    title: 'Usuario registrado',
    data: {
      idUser: userResgister.id,
      email: userResgister.email,
    },
  });
}

export async function postLogiUser(req: Request, res: Response) {
  const { body: values }: { body: z.infer<typeof loginUserSchema> } = req;

  const user = await findUserByEmail(values.email);

  if (!user) {
    throw new ApiError({
      title: 'El usuario no existe',
      details: `El usuario con email ${values.email} no esta registrado.`,
      statusCode: 400,
      success: false,
    });
  }

  const isValidatePassword = await comparePasswordAsync(
    values.password,
    user.password
  );

  if (!isValidatePassword) {
    throw new ApiError({
      title: 'Contraseña incorrecta',
      details: `La contraseña que ha ingresado es incorrecta.`,
      statusCode: 400,
      success: false,
    });
  }

  const token = signJwtUser({
    email: user.email,
    id: user.id,
    userSecret: user.userSecret,
  });

  res.status(200).json({
    message: 'Login correcto',
    title: 'Usuario ha iniciado sesión correctamente.',
    data: {
      token,
    },
  });
}
