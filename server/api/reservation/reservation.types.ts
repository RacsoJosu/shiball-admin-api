// reservation.types.ts
const TYPES_RESERVATION = {
  ReservationController: Symbol.for('ReservationController'),
  ReservationService: Symbol.for('ReservationService'),
  ReservationRepository: Symbol.for('ReservationRepository'),
  databaseConnection: Symbol.for('DataBaseConnection')
};

export default TYPES_RESERVATION;
