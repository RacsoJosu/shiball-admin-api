// dashboard.router.ts
import express from 'express';
import { DashboardController } from './dashboard.controller';
import TYPES_DASHBOARD from './dashboard.types';
import container from '../containers/container';
import { authGuard } from '../../middlewares/auth';

const dashboardController = container.get<DashboardController>(
  TYPES_DASHBOARD.DashboardController
);
const router = express.Router();

router.get(
  '/',
  authGuard,
  dashboardController.getAllStatsDashboard.bind(dashboardController)
);

export default router;
