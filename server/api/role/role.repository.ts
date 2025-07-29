import z from 'zod';
import { PrismaClient, Role } from '@prisma/client';
import { injectable, inject } from 'inversify';
import TYPES_COMMON from '../../types/common.types';
import { inputRoleCreateSchema } from './role.schemas';
import { IRead, IWrite } from '../../shared/interfaces';
import { pagination } from '../../shared/libs/helpers';
import { searchPaginationParamsSchema } from '../../shared/schemas';
import dayjs from 'dayjs';
interface RoleDTO extends z.infer<typeof inputRoleCreateSchema> {}
interface RoleUpdateInput extends Partial<RoleDTO> {}
@injectable()
export class RoleRepository
  implements IWrite<Role, RoleDTO, Role['id']>, IRead<RoleDTO, Role['id']>
{
  constructor(
    @inject(TYPES_COMMON.databaseConnection)
    private readonly prisma: PrismaClient
  ) {}

  async create(element: RoleDTO): Promise<Role | null> {
    return this.prisma.role.create({
      data: {
        ...element,
        createdAt: dayjs().toDate(),
        updatedAt: dayjs().toDate(),
      },
    });
  }
  async update(id: Role['id'], element: RoleUpdateInput): Promise<Role | null> {
    return this.prisma.role.update({
      data: {
        ...element,
        updatedAt: dayjs().toDate(),
      },
      where: {
        id,
      },
    });
  }
  async delete(id: Role['id']): Promise<Role | null> {
    return this.prisma.role.update({
      data: {
        deletedAt: dayjs().toDate(),
      },
      where: {
        id,
      },
    });
  }
  async getAll(params: z.infer<typeof searchPaginationParamsSchema>) {
    const { limit: take, skip } = pagination(params);

    if (params.search) {
      params.search = `%${params.search.replaceAll(' ', '%%')}%`;
    }

    const where = this.getWhereAllRoles(params);
    return this.prisma.role.findMany({
      take,
      skip,
      where,
    });
  }

  async countAllRoles(params: z.infer<typeof searchPaginationParamsSchema>) {
    const where = this.getWhereAllRoles(params);
    return await this.prisma.role.count({ where });
  }

  getWhereAllRoles(params: z.infer<typeof searchPaginationParamsSchema>) {
    let where = {};
    if (params.search) {
      where = {
        OR: [
          {
            name: {
              contains: params.search,
              mode: 'insensitive',
            },
          },
        ],
      };
    }

    return where;
  }
  async getById(id: Role['id']) {
    return this.prisma.role.findUnique({
      omit: {
        updatedAt: true,
        deletedAt: true,
        createdAt: true,
      },
      where: { id },
    });
  }
}
