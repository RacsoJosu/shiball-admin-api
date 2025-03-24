import { Request, Response } from 'express';
import { prisma } from '../../config/db';
import { UserRepository } from '../auth/auth.repository';
import { UserService } from './user.service';
import { seachParamsSchema } from './user.schemas';

const userRepository = new UserRepository(prisma);
const userService = new UserService(userRepository);
export async function getAllUsers(req: Request, res: Response) {
    const values = await seachParamsSchema.parseAsync(req.query)
    console.log(req.query)
  const users = await userService.getAll(values.search);
  res.status(200).json({
    message: 'Lista de usuarios',
    title: 'Usuarios obtenidos',
    data: users,
  });
  return;
}
