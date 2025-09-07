// properties.service.ts

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
  async findAll(params: { limit: number; page: number; search?: string }) {
    const [properties, total] = await Promise.all([
      this.propertiesRepository.getAll(params),
      this.propertiesRepository.countAllProperties(params),
    ]);
    const { limit, page } = pagination(params);

    return {
      properties,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
}
