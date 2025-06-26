import { Container } from 'inversify';
import { PropertiesController } from '../../properties/properties.controller';
import TYPES_PROPERTIES from '../../properties/properties.types';

export function bindPropertiesModule(container: Container) {
  container
    .bind<PropertiesController>(TYPES_PROPERTIES.PropertiesController)
    .to(PropertiesController)
    .inRequestScope();
}
