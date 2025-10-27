// dashboard.service.ts;
import { inject, injectable } from 'inversify';
import TYPES_USER from '../users/user.types';
import TYPES_PROPERTIES from '../properties/properties.types';
import TYPES_RESERVATION from '../reservation/reservation.types';
import { UserService } from '../users/user.service';
import { PropertiesService } from '../properties/properties.service';
import { ReservationService } from '../reservation/reservation.service';
@injectable()
export class DashboardService {
  constructor(
    @inject(TYPES_USER.UserService)
    private readonly userService: UserService,
    @inject(TYPES_PROPERTIES.PropertiesService)
    private readonly propertiesService: PropertiesService,
    @inject(TYPES_RESERVATION.ReservationService)
    private readonly reservationService: ReservationService
  ) {}
  async getStats() {
    const data = await Promise.all([
      this.userService.getStatsUsers(),
      this.propertiesService.getStatsProperties(),
      this.reservationService.getStatsReservation(),
      this.reservationService.getStatsIngresosReservation(),
    ]);

    return data.flat();
  }
}
