import { Request, Response } from 'express';
import { UserService } from './user.service';
import { idUSerSchema, searchPaginationParamsSchema } from './user.schemas';
import { inject, injectable } from 'inversify';
import TYPES_USER from './user.types';

@injectable()
export class UserController {
  constructor(
    @inject(TYPES_USER.UserService) private readonly userService: UserService
  ) {
    console.log('Controller initialized, userService:', !!userService);
  }

  async getAllUsers(req: Request, res: Response) {
    const values = await searchPaginationParamsSchema.parseAsync(req.query);
    const data = await this.userService.getAll(values);

    res.status(200).json({
      message: 'Lista de usuarios',
      title: 'Usuarios obtenidos',
      data,
    });
  }

  async getUserById(req: Request, res: Response) {
    const values = await idUSerSchema.parseAsync(req.params);
    const data = await this.userService.getById(values);
    res.status(200).json({
      title: 'Usuarios obtenido',
      message: 'Usuario encontrado',
      data,
    });
  }
}
