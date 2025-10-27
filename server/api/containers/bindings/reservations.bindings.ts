import { Container } from 'inversify';
import { ReservationController } from '../../reservation/reservation.controller';
import { ReservationService } from '../../reservation/reservation.service';
import { ReservationRepository } from '../../reservation/reservation.repository';
import TYPES_USER from '../../reservation/reservation.types';

export function bindReservationModule(container: Container) {
  container
    .bind<ReservationController>(TYPES_USER.ReservationController)
    .to(ReservationController)
    .inRequestScope();
  container
    .bind<ReservationService>(TYPES_USER.ReservationService)
    .to(ReservationService)
    .inRequestScope();
  container
    .bind<ReservationRepository>(TYPES_USER.ReservationRepository)
    .to(ReservationRepository)
    .inRequestScope();
}
