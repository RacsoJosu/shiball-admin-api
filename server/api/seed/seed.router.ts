import { Router } from 'express';
import container from '../containers/container';
import { SeedController } from './seed.controller';
import TYPES_SEED from './seed.types';
const router = Router();
const seedModule = container.get<SeedController>(TYPES_SEED.SEED_CONTROLLER);

router.get('/usuarios', seedModule.postResgisterManyUser.bind(SeedController));

export default router;
