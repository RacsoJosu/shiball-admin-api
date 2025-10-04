import { Request, Response } from 'express';
import z from 'zod';
import { loginUserSchema, registerUserSchema } from './auth.schemas';
import { inject, injectable } from 'inversify';
import { UserService } from '../users/user.service';
import TYPES_USER from '../users/user.types';
import { ApiError } from '../../middlewares/statusCode';
@injectable()
export class AuthController {
  constructor(
    @inject(TYPES_USER.UserService) private readonly userService: UserService
  ) {
    console.log('AuthController initialized, userService:', !!userService);
  }

  async postResgisterUser(req: Request, res: Response) {
    const values = registerUserSchema.parse(req.body);
    const userRegistered = await this.userService.addUser(values);
    const { token } = await this.userService.login(values);
    res.cookie('AUTH_TOKEN', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      path: '/',
      maxAge: 604800000,
    });
    res.status(201).send({
      message: 'Usuario creado',
      title: 'Usuario registrado',
      data: {
        idUser: userRegistered.id,
        email: userRegistered.email,
      },
    });
  }

  async postLogiUser(req: Request, res: Response) {
    const { body: values }: { body: z.infer<typeof loginUserSchema> } = req;

    const { token } = await this.userService.login(values);

    res.cookie('AUTH_TOKEN', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      path: '/',
      maxAge: 604800000,
    });

    res.status(200).send({
      message: 'Login correcto',
      title: 'Usuario ha iniciado sesión correctamente.',
      data: token,
    });
  }

  async postLogoutUser(req: Request, res: Response) {
    res
      .clearCookie('AUTH_TOKEN', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        path: '/',
        maxAge: 604800000,
      })
      .status(200)
      .json({
        message: 'Se ha cerrado sesión correctamente.',
        title: 'Logout correcto',
      });
  }

  async getUserAuthInfo(req: Request, res: Response) {
    const { user } = req;

    if (!user) {
      throw new ApiError({
        title: 'No existe el usuario',
        statusCode: 400,
        details: 'Usuario no existe.',
      });
    }

    const tokenCookie = req.cookies.AUTH_TOKEN;

    const { infoUser } = await this.userService.getInfoAuthUser({
      email: user.email || '',
      token: tokenCookie,
    });

    res.status(200).send({
      message: 'Login correcto',
      title: 'Usuario ha iniciado sesión correctamente.',
      data: infoUser,
    });
  }
}
