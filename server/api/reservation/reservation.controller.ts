// reservation.controller.ts
import { Request, Response } from 'express';
import { ReservationService } from './reservation.service';
import { searchPaginationParamsSchema } from '../../shared/schemas';
import { inject, injectable } from 'inversify';
import TYPES_RESERVATION from './reservation.types';

@injectable()
export class ReservationController {
  constructor(
    @inject(TYPES_RESERVATION.ReservationService) private readonly reservationService: ReservationService
  ) {
    console.log('Controller initialized, ReservationService:', !!reservationService);
  }

  async getAllReservation(req: Request, res: Response) {
    // implementar get All

    res.status(200).json({
      message: 'Lista de usuarios',
      title: 'Usuarios obtenidos',
      data:null,
    });
  }
}

