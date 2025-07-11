// properties.controller.ts
import { Request, Response } from 'express';
import { PropertiesService } from './properties.service';
import { searchPaginationParamsSchema } from '../../shared/schemas';
import { inject, injectable } from 'inversify';
import TYPES_PROPERTIES from './properties.types';

@injectable()
export class PropertiesController {
  constructor(
    @inject(TYPES_PROPERTIES.PropertiesService)
    private readonly propertiesService: PropertiesService
  ) {
    console.log(
      'Controller initialized, PropertiesService:',
      !!propertiesService
    );
  }

  async getAllProperties(req: Request, res: Response) {
    const values = await searchPaginationParamsSchema.parseAsync(req.query);
    const data = await this.propertiesService.findAll({
      limit: values.limit ?? 10,
      page: values.page ?? 1,
      search: values.search,
    });

    if (data.length === 0) {
      res.status(200).json({
        message: 'Lista de usuarios vacia',
        title: 'No hay usuarios',
        data: data,
      });
      return;
    }

    res.status(200).json({
      message: 'Lista de usuarios',
      title: 'Usuarios obtenidos',
      data: data,
    });
  }
}
