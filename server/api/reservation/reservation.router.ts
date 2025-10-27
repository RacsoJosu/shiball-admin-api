// reservation.router.ts
import express from 'express';
import { ReservationController } from './reservation.controller';
import TYPES_RESERVATION from './reservation.types';
import container from '../containers/container';
import { authGuard } from '../../middlewares/auth';

const reservationController = container.get<ReservationController>(TYPES_RESERVATION.ReservationController);
const router = express.Router();

router.get('/', authGuard, reservationController.getAllReservation.bind(reservationController));

export default router;
