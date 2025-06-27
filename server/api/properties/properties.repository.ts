// properties.repository.ts

import z from 'zod';
import { PrismaClient, Properties } from '@prisma/client';
import { injectable, inject } from 'inversify';
import TYPES_COMMON from '../../types/common.types';
import { inputPropertiesCreateSchema } from './properties.schemas';
import { IRead, IWrite } from '../../shared/interfaces';
import { pagination } from '../../shared/libs/helpers';
import { searchPaginationParamsSchema } from '../../shared/schemas';
import dayjs from 'dayjs';

type PropertiesDTO = z.infer<typeof inputPropertiesCreateSchema>;

type PropertiesUpdateInput = Partial<PropertiesDTO>;
@injectable()
export class PropertiesRepository
  implements
    IWrite<Properties, PropertiesDTO, Properties['id']>,
    IRead<Partial<Properties>, Properties['id']>
{
  constructor(
    @inject(TYPES_COMMON.databaseConnection)
    private readonly prisma: PrismaClient
  ) {}

  async create(element: PropertiesDTO): Promise<Properties | null> {
    return this.prisma.properties.create({
      data: {
        ...element,
        createdAt: dayjs().toDate(),
        updatedAt: dayjs().toDate(),
      },
    });
  }
  async update(
    id: Properties['id'],
    element: PropertiesUpdateInput
  ): Promise<Properties | null> {
    return this.prisma.properties.update({
      data: {
        ...element,
        updatedAt: dayjs().toDate(),
      },
      where: {
        id,
      },
    });
  }
  async delete(id: Properties['id']): Promise<Properties | null> {
    return this.prisma.properties.update({
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
      params.search = `%${params.search.replaceAll(' ', '%%')}`;
    }

    const where = this.getWhereAllProperties(params);
    const data = await Promise.all([
      this.prisma.properties.findMany({
        select: {
          id: true,
          fkIdUSer: true,
          capacity: true,
          description: true,
          type: true,
          Dwelling: {
            select: {
              id: true,
              city: true,
              county: true,
              address: true,
              latitude: true,
              longitude: true,
            },
          },
        },
        take,
        skip,
        where: {
          ...where,
          Dwelling: {
            NOT: {},
          },
        },
      }),
      this.prisma.properties.findMany({
        select: {
          id: true,
          fkIdUSer: true,
          capacity: true,
          description: true,
          type: true,
          Vehicles: {
            select: {
              id: true,
              description: true,
              brand: true,
              model: true,
            },
          },
        },
        take,
        skip,
        where: { ...where, Vehicles: {} },
      }),
    ]);
    return data.flat();
  }

  async countAllProperties(
    params: z.infer<typeof searchPaginationParamsSchema>
  ) {
    const where = this.getWhereAllProperties(params);
    return await this.prisma.properties.count({ where });
  }

  getWhereAllProperties(params: z.infer<typeof searchPaginationParamsSchema>) {
    let where = {};
    if (params.search) {
      where = {
        OR: [
          {
            id: {
              contains: params.search,
              mode: 'insensitive',
            },
          },
        ],
      };
    }

    return where;
  }
  async getById(id: Properties['id']) {
    return this.prisma.properties.findUnique({
      omit: {
        updatedAt: true,
        deletedAt: true,
        createdAt: true,
      },
      where: { id },
    });
  }
}
