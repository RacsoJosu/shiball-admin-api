// reservation.service.ts
import z from 'zod';
import { Reservation } from '@prisma/client';
import { ApiError } from '../../middlewares/statusCode';
import { pagination } from '../../shared/libs/helpers';
import { ReservationRepository } from './reservation.repository';
import TYPES_RESERVATION from './reservation.types';
import { inject, injectable } from 'inversify';
import dayjs from '../../shared/libs/dayjs-wrapper';
import { DEFAULT_FORMAT_DATE } from '../../shared/const';
@injectable()
export class ReservationService {
  constructor(
    @inject(TYPES_RESERVATION.ReservationRepository)
    private readonly reservationRepository: ReservationRepository
  ) {}
  async getStatsReservation() {
    const [total, totalThisMonth] = await Promise.all([
      this.reservationRepository.getTotalReservation({}),
      this.reservationRepository.getTotalReservation({
        dateFilter: dayjs().format(DEFAULT_FORMAT_DATE),
      }),
    ]);

    return {
      title: 'Reservas realizadas',
      total,
      totalThisMonth,
      icon: 'calendar',
    };
  }

  async getStatsIngresosReservation() {
    const [total, totalThisMonth] = await Promise.all([
      this.reservationRepository.getTotalIngresosReservation({}),
      this.reservationRepository.getTotalIngresosReservation({
        dateFilter: dayjs().format(DEFAULT_FORMAT_DATE),
      }),
    ]);
    const formatterDolares = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });

    return {
      title: 'Ingresos Totales',
      total: formatterDolares.format(Number(total)),
      totalThisMonth: formatterDolares.format(Number(totalThisMonth)),
      icon: 'dollar',
    };
  }
}
