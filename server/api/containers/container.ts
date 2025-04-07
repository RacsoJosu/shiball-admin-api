import { Container } from 'inversify';
import { bindUserModule } from './bindings/user.binding';
import { bindAuthModule } from './bindings/auth.binding';
import { PrismaClient } from '@prisma/client';
import TYPES_USER from '../users/user.types';
import { prisma } from '../../config/db';

const container = new Container();

// Prisma como singleton
    container.bind<PrismaClient>(TYPES_USER.databaseConnection).toConstantValue(prisma);

// Cargar módulos
bindUserModule(container);
bindAuthModule(container);

export default container;