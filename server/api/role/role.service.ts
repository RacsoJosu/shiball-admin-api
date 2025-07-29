// role.service.ts
import z from 'zod';
import { Role } from '@prisma/client';
import { ApiError } from '../../middlewares/statusCode';
import { pagination } from '../../shared/libs/helpers';
import { RoleRepository } from './role.repository';
import TYPES_ROLE from './role.types';
import { inject, injectable } from 'inversify';
import { searchPaginationParamsSchema } from '../users/user.schemas';
@injectable()
export class RoleService {
  constructor(
    @inject(TYPES_ROLE.RoleRepository)
    private readonly roleRepository: RoleRepository
  ) {}
  async findAll(params: z.infer<typeof searchPaginationParamsSchema>) {
    return this.roleRepository.getAll(params);
  }
}
