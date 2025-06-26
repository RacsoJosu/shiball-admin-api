// properties.controller.ts
import { Request, Response } from 'express';
import { PropertiesService } from './properties.service';
import { searchPaginationParamsSchema } from '../../shared/schemas';
import { inject, injectable } from 'inversify';
import TYPES_PROPERTIES from './properties.types';

@injectable()
export class PropertiesController {
  constructor(
    @inject(TYPES_PROPERTIES.PropertiesService) private readonly propertiesService: PropertiesService
  ) {
    console.log('Controller initialized, PropertiesService:', !!propertiesService);
  }

  async getAllProperties(req: Request, res: Response) {
    // implementar get All

    res.status(200).json({
      message: 'Lista de usuarios',
      title: 'Usuarios obtenidos',
      data:null,
    });
  }
}

