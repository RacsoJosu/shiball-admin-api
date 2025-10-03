// properties.controller.ts
import { Request, Response } from 'express';
import { PropertiesService } from './properties.service';
import { searchPaginationParamsSchema } from '../../shared/schemas';
import { inject, injectable } from 'inversify';
import TYPES_PROPERTIES from './properties.types';
import { propertySchema } from './properties.schemas';

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

    res.status(200).json({
      message: 'Lista de propiedades',
      title: 'Propiedades obtenidas',
      data: data,
    });
  }

  async addPropertie(req: Request, res: Response) {
    const values = await propertySchema.parseAsync(req.body);

    await this.propertiesService.add(values);
    res.status(200).json({
      message: 'Propiedad agregada',
      title: 'Propiedad agregada',
      data: null,
    });
  }
}
