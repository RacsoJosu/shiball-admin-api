import { Container } from 'inversify';
import { PropertiesController } from '../../properties/properties.controller';
import TYPES_PROPERTIES from '../../properties/properties.types';
import { PropertiesService } from '../../properties/properties.service';
import { PropertiesRepository } from '../../properties/properties.repository';

export function bindPropertiesModule(container: Container) {
  container
    .bind<PropertiesRepository>(TYPES_PROPERTIES.PropertiesRepository)
    .to(PropertiesRepository)
    .inRequestScope();
  container
    .bind<PropertiesService>(TYPES_PROPERTIES.PropertiesService)
    .to(PropertiesService)
    .inRequestScope();
  container
    .bind<PropertiesController>(TYPES_PROPERTIES.PropertiesController)
    .to(PropertiesController)
    .inRequestScope();
}
