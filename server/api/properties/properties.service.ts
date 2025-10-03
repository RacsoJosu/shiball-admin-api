// properties.service.ts

import z from 'zod';
import { pagination } from '../../shared/libs/helpers';
import { PropertiesRepository } from './properties.repository';
import TYPES_PROPERTIES from './properties.types';
import { inject, injectable } from 'inversify';
import { propertySchema } from './properties.schemas';
import TYPES_USER from '../users/user.types';
import { UserRepository } from '../users/user.repository';
@injectable()
export class PropertiesService {
  constructor(
    @inject(TYPES_PROPERTIES.PropertiesRepository)
    private readonly propertiesRepository: PropertiesRepository,
    @inject(TYPES_USER.UserRepository)
    private readonly userRepository: UserRepository
  ) {}
  async add(values: z.infer<typeof propertySchema>) {
    const user = await this.userRepository.getRandomUser();

    return this.propertiesRepository.create({ ...values, fkIdUSer: user.id });
  }
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
