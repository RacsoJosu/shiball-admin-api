import { Container } from 'inversify';
import { bindUserModule } from './bindings/user.binding';
import { bindAuthModule } from './bindings/auth.binding';
import { PrismaClient } from '@prisma/client';

import { prisma } from '../../config/db';
import { bindSeedModule } from './bindings/seed.binding';
import { bindAllModule } from './bindings/all-bindings';
import TYPES_COMMON from '../../types/common.types';
import { bindPropertiesModule } from './bindings/properties.bindings';

const container = new Container();

// Prisma como singleton
container
  .bind<PrismaClient>(TYPES_COMMON.databaseConnection)
  .toConstantValue(prisma);

// Cargar módulos
bindUserModule(container);
bindAuthModule(container);
bindSeedModule(container);
bindPropertiesModule(container);

export default container;
