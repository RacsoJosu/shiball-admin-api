// properties.repository.ts

import z from 'zod';
import { Prisma, PrismaClient, Properties, TypeVehicles } from '@prisma/client';
import { injectable, inject } from 'inversify';
import TYPES_COMMON from '../../types/common.types';
import {
  inputPropertiesCreateSchema,
  propertySchema,
} from './properties.schemas';
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

  async create(
    element: z.infer<typeof propertySchema> & { fkIdUSer: string }
  ): Promise<Properties | null> {
    const now = dayjs().toDate();

    if (element.type === 'DWELLING') {
      const {
        city,
        country,
        address,
        latitude,
        longitude,

        fkIdUSer,
        type,
        ...base
      } = element;

      return this.prisma.properties.create({
        data: {
          ...base,
          type,
          fkIdUSer: element.fkIdUSer,
          createdAt: now,
          updatedAt: now,
          Dwelling: {
            create: {
              city,
              county: country,
              address,
              latitude: new Prisma.Decimal(latitude),
              longitude: new Prisma.Decimal(longitude),
            },
          },
        },
      });
    }

    if (element.type === 'VEHICLE') {
      const { brand, model, typeVehicle, type, ...base } = element;

      return this.prisma.properties.create({
        data: {
          ...base,
          type,
          fkIdUSer: element.fkIdUSer,
          createdAt: now,
          updatedAt: now,
          Vehicles: {
            create: {
              description: base.description,
              brand,
              model,
              type: typeVehicle as TypeVehicles,
            },
          },
        },
      });
    }

    // opcional: lanzar error si type no es válido
    throw new Error('Tipo de propiedad inválido');
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
      params.search = `%${params.search.replaceAll(' ', '%%')}%`;
    }

    const where = this.getWhereAllProperties(params);
    return this.prisma.properties.findMany({
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
      where,
    });
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
          {
            description: {
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
