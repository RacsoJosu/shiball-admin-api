// role.controller.ts
import { Request, Response } from 'express';
import { RoleService } from './role.service';
import { searchPaginationParamsSchema } from '../../shared/schemas';
import { inject, injectable } from 'inversify';
import TYPES_ROLE from './role.types';

@injectable()
export class RoleController {
  constructor(
    @inject(TYPES_ROLE.RoleService) private readonly roleService: RoleService
  ) {
    console.log('Controller initialized, RoleService:', !!roleService);
  }

  async getAllRole(req: Request, res: Response) {
    const values = await searchPaginationParamsSchema.parseAsync(req.query);
    const roles = await this.roleService.findAll({
      limit: values.limit,
      page: values.page,
      search: values.search,
    });

    res.status(200).json({
      message: 'Lista de roles',
      title: 'Roles obtenidos',
      data: roles,
    });
  }
}
