// properties.service.ts
import z from 'zod';
import { Properties } from '@prisma/client';
import { ApiError } from '../../middlewares/statusCode';
import { pagination } from '../../shared/libs/helpers';
import { PropertiesRepository } from './properties.repository';
import TYPES_PROPERTIES from './properties.types';
import { inject, injectable } from 'inversify';
@injectable()
export class PropertiesService {
constructor(
    @inject(TYPES_PROPERTIES.PropertiesRepository)
    private readonly propertiesRepository: PropertiesRepository
  ) {}
  async findAll() {
    // Implementación aquí
    return [];
  }
}
