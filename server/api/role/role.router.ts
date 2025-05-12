// role.router.ts
import express from 'express';
import { RoleController } from './role.controller';
import TYPES_ROLE from './role.types';
import container from '../containers/container';
import { authGuard } from '../../middlewares/auth';

const roleController = container.get<RoleController>(TYPES_ROLE.RoleController);
const router = express.Router();

router.get('/', authGuard, roleController.getAllRole.bind(roleController));

export default router;
