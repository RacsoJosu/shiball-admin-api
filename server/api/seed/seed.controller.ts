import { Request, Response } from 'express';
import { SEED_USER } from './data/data';
import { UserRepository } from '../users/user.repository';
import { prisma } from '../../config/db';
import { UserService } from '../users/user.service';
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
}
