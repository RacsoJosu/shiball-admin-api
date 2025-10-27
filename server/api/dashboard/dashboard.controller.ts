// dashboard.controller.ts
import { Request, Response } from 'express';
import { DashboardService } from './dashboard.service';
import { searchPaginationParamsSchema } from '../../shared/schemas';
import { inject, injectable } from 'inversify';
import TYPES_DASHBOARD from './dashboard.types';

@injectable()
export class DashboardController {
  constructor(
    @inject(TYPES_DASHBOARD.DashboardService)
    private readonly dashboardService: DashboardService
  ) {
    console.log(
      'Controller initialized, DashboardService:',
      !!dashboardService
    );
  }

  async getAllStatsDashboard(req: Request, res: Response) {
    const data = await this.dashboardService.getStats();

    res.status(200).json({
      title: 'Información dashboard',
      message: 'Información encontrada',
      data: data,
    });
  }
}
