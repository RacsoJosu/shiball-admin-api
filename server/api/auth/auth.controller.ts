import { Request, Response } from 'express';
import z from 'zod';
import { prisma } from '../../config/prisma';
import { loginUserSchema, registerUserSchema } from './auth.schemas';
import { AuthService } from './auth.service';
import { UserRepository } from './auth.repository';
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

  const { token, infoUser } = await authService.login(values);

  res
    .status(200)
    .cookie('ACCESS_TOKEN', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 100 * 60 * 60,
    })
    .json({
      message: 'Login correcto',
      title: 'Usuario ha iniciado sesión correctamente.',
      data: {
        token,
        infoUser,
      },
    });
}


export async function postLogoutUser(req: Request, res: Response) {
  
  res
    .clearCookie("ACCESS_TOKEN")
    .status(200)
    .json({
      message: 'Logout correcto',
      title: 'Se ha cerrado sesión correctamente.',
      
    });
}
