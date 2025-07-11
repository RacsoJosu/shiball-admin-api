import express from 'express';
import { UserController } from './user.controller';
import TYPES_USER from './user.types';
import container from '../containers/container';
import { authGuard } from '../../middlewares/auth';

const userController = container.get<UserController>(TYPES_USER.UserController);
const router = express.Router();

router.get('/', authGuard, userController.getAllUsers.bind(userController));
router.get(
  '/:idUser',
  authGuard,
  userController.getUserById.bind(userController)
);

router.patch(
  '/:idUser',
  authGuard,
  userController.patchUser.bind(userController)
);

export default router;
