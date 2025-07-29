import { Container } from 'inversify';
import { bindUserModule } from './bindings/user.binding';
import { bindAuthModule } from './bindings/auth.binding';
import { PrismaClient } from '@prisma/client';

import { prisma } from '../../config/db';
import { bindSeedModule } from './bindings/seed.binding';

import TYPES_COMMON from '../../types/common.types';
import { bindPropertiesModule } from './bindings/properties.bindings';
import { bindRoleModule } from './bindings/roles.bindings';

const container = new Container();

// Prisma como singleton
container
  .bind<PrismaClient>(TYPES_COMMON.databaseConnection)
  .toConstantValue(prisma);

bindUserModule(container);
bindAuthModule(container);
bindSeedModule(container);
bindPropertiesModule(container);
bindRoleModule(container);

export default container;
