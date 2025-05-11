import { Request, Response } from 'express';
import { SEED_USER } from './data/data';
import { inject, injectable } from 'inversify';
import TYPES_USER from '../users/user.types';
import { UserService } from '../users/user.service';

@injectable()
export class SeedController {
  constructor(
    @inject(TYPES_USER.UserService) private readonly userService: UserService
  ) {
    console.log('SeedController initialized, userService:', !!userService);
  }
  async postResgisterManyUser(req: Request, res: Response) {
    const data = await this.userService.addManyUser(SEED_USER);

    res.status(200).send({
      message: 'Usuarios creados',
      title: 'Usuarios registrados',
      data,
    });
  }
  async postRegisterManyRolesUser(req: Request, res: Response) {
    const data = null;

    res.status(200).send({
      message: 'Usuarios creados',
      title: 'Usuarios registrados',
      data,
    });
  }
}
