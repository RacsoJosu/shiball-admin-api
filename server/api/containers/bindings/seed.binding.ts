import { Container } from 'inversify';
import { SeedController } from '../../seed/seed.controller';
import TYPES_SEED from '../../seed/seed.types';

export function bindSeedModule(container: Container) {
  container
    .bind<SeedController>(TYPES_SEED.SEED_CONTROLLER)
    .to(SeedController)
    .inRequestScope();
}
