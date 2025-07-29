import { Container } from 'inversify';
import { RoleController } from '../../role/role.controller';
import TYPES_ROLE from '../../role/role.types';
import { RoleService } from '../../role/role.service';
import { RoleRepository } from '../../role/role.repository';

export function bindRoleModule(container: Container) {
  container
    .bind<RoleController>(TYPES_ROLE.RoleController)
    .to(RoleController)
    .inRequestScope();
  container
    .bind<RoleService>(TYPES_ROLE.RoleService)
    .to(RoleService)
    .inRequestScope();
  container
    .bind<RoleRepository>(TYPES_ROLE.RoleRepository)
    .to(RoleRepository)
    .inRequestScope();
}
