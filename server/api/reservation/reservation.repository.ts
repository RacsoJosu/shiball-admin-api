// reservation.repository.ts

import z from 'zod';
import { PrismaClient, Reservation } from '@prisma/client';
import { injectable, inject } from 'inversify';
import TYPES_COMMON from '../../types/common.types';
import { inputReservationCreateSchema } from './reservation.schemas';
import { IRead, IWrite } from '../../shared/interfaces';
import { pagination } from '../../shared/libs/helpers';
import { searchPaginationParamsSchema } from '../../shared/schemas';
import dayjs from 'dayjs';

type ReservationDTO = Reservation;
type ReservationUpdateInput = Partial<ReservationDTO>;
@injectable()
export class ReservationRepository
  implements
    IWrite<Reservation, ReservationDTO, Reservation['id']>,
    IRead<ReservationDTO, Reservation['id']>
{
  constructor(
    @inject(TYPES_COMMON.databaseConnection)
    private readonly prisma: PrismaClient
  ) {}

  async create(element: ReservationDTO): Promise<Reservation | null> {
    return this.prisma.reservation.create({
      data: {
        ...element,
        createdAt: dayjs().toDate(),
        updatedAt: dayjs().toDate(),
      },
    });
  }
  async update(
    id: Reservation['id'],
    element: ReservationUpdateInput
  ): Promise<Reservation | null> {
    return this.prisma.reservation.update({
      data: {
        ...element,
        updatedAt: dayjs().toDate(),
      },
      where: {
        id,
      },
    });
  }
  async delete(id: Reservation['id']): Promise<Reservation | null> {
    return this.prisma.reservation.update({
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

    const where = this.getWhereAllReservation(params);
    return this.prisma.reservation.findMany({
      take,
      skip,
      where,
    });
  }

  async countAllReservation(
    params: z.infer<typeof searchPaginationParamsSchema>
  ) {
    const where = this.getWhereAllReservation(params);
    return await this.prisma.reservation.count({ where });
  }

  async getTotalReservation({ dateFilter }: { dateFilter?: string }) {
    let where = {};
    if (dateFilter) {
      where = {
        createdAt: {
          gte: dayjs(dateFilter).startOf('month').toDate(),
        },
      };
    }
    return this.prisma.reservation.count({
      where: {
        AND: {
          ...where,
          deletedAt: null,
        },
      },
    });
  }

  async getTotalIngresosReservation({ dateFilter }: { dateFilter?: string }) {
    const where: any = {};

    if (dateFilter) {
      const start = dayjs(dateFilter).startOf('month').toDate();
      const end = dayjs(dateFilter).endOf('month').toDate();

      where.createdAt = {
        gte: start,
        lte: end, // 🔹 agrega límite superior para incluir todo el mes
      };
    }

    const result = await this.prisma.rate.aggregate({
      _sum: {
        price: true,
      },
      where,
    });

    // Devuelve el valor numérico limpio (por defecto puede venir null)
    return result._sum.price ?? 0;
  }

  getWhereAllReservation(params: z.infer<typeof searchPaginationParamsSchema>) {
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
  async getById(id: Reservation['id']) {
    return this.prisma.reservation.findUnique({
      where: { id },
    });
  }
}
