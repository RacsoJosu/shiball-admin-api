import { Container } from 'inversify';
import { DashboardController } from '../../dashboard/dashboard.controller';
import { DashboardService } from '../../dashboard/dashboard.service';
import TYPES_USER from '../../dashboard/dashboard.types';

export function bindDashboardModule(container: Container) {
  container
    .bind<DashboardController>(TYPES_USER.DashboardController)
    .to(DashboardController)
    .inRequestScope();
  container
    .bind<DashboardService>(TYPES_USER.DashboardService)
    .to(DashboardService)
    .inRequestScope();
}
