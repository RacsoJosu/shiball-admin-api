import { Container } from 'inversify';
import { UserController } from '../../users/user.controller';
import { UserService } from '../../users/user.service';
import { UserRepository } from '../../users/user.repository';
import TYPES_USER from '../../users/user.types';

export function bindUserModule(container: Container) {
  container
    .bind<UserController>(TYPES_USER.UserController)
    .to(UserController)
    .inRequestScope();
  container
    .bind<UserService>(TYPES_USER.UserService)
    .to(UserService)
    .inRequestScope();
  container
    .bind<UserRepository>(TYPES_USER.UserRepository)
    .to(UserRepository)
    .inRequestScope();
}
