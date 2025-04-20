import { Request, Response } from 'express';
import { prisma } from '@config/db';
import { SEED_USER } from './data/data';
import { UserService } from '@api/users/user.service';
import { UserRepository } from '@api/users/user.repository';
// Iniciar dependencias
const userRepository = new UserRepository(prisma);
const authService = new UserService(userRepository);

export async function postResgisterManyUser(req: Request, res: Response) {
  const data = await authService.addManyUser(SEED_USER);

  res.status(200).send({
    message: 'Usuarios creados',
    title: 'Usuarios registrados',
    data,
  });
  return
}
