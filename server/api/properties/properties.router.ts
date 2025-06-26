// properties.router.ts
import express from 'express';
import { PropertiesController } from './properties.controller';
import TYPES_PROPERTIES from './properties.types';
import container from '../containers/container';
import { authGuard } from '../../middlewares/auth';

const propertiesController = container.get<PropertiesController>(TYPES_PROPERTIES.PropertiesController);
const router = express.Router();

router.get('/', authGuard, propertiesController.getAllProperties.bind(propertiesController));

export default router;
