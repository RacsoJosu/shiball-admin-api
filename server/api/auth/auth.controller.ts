import { Request, Response } from 'express';
import z from 'zod';
import { prisma } from '../../config/db';
import { loginUserSchema, registerUserSchema } from './auth.schemas';
import { AuthService } from './auth.service';
import { UserRepository } from './auth.repository';
import { ApiError } from '../../middlewares/statusCode';
// Iniciar dependencias
const userRepository = new UserRepository(prisma);
const authService = new AuthService(userRepository);

export async function postResgisterUser(req: Request, res: Response) {
  const values = registerUserSchema.parse(req.body);
  const userRegistered = await authService.addUser(values);

  res.status(201).json({
    message: 'Usuario creado',
    title: 'Usuario registrado',
    data: {
      idUser: userRegistered.id,
      email: userRegistered.email,
    },
  });
}

export async function postLogiUser(req: Request, res: Response) {
  const { body: values }: { body: z.infer<typeof loginUserSchema> } = req;

  const { token } = await authService.login(values);

  res
    .cookie('AUTH_TOKEN', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: "/",
      maxAge: 604800000,
      // domain: process.env.NODE_ENV === 'production' ? 'shiball-admin-api.vercel.app' : undefined
    
    })


    res.status(200)
    .json({
      message: 'Login correcto',
      title: 'Usuario ha iniciado sesión correctamente.',
      data: token,
    });
}

export async function postLogoutUser(req: Request, res: Response) {
  
  res.clearCookie('AUTH_TOKEN').status(200).json({
    message: 'Se ha cerrado sesión correctamente.',
    title: 'Logout correcto',
  });
}

export async function getUserAuthInfo(req: Request, res: Response) {
  const { user } = req;

  if (!user) {
    throw new ApiError({
      title: 'No existe el usuario',
      statusCode: 400,
      details: 'Usuario no existe.',
    });
  }

  const tokenCookie = req.cookies.AUTH_TOKEN;

  const { infoUser } = await authService.getInfoAuthUser({
    email: user.email || '',
    token: tokenCookie,
  });

  res.status(200).json({
    message: 'Login correcto',
    title: 'Usuario ha iniciado sesión correctamente.',
    data: infoUser
  });
}
