import express from 'express';

import usersRouter from '../../server/api/users/users.router';
import authRouter from '../../server/api/auth/auth.router';
import seedRouter from '../../server/api/seed/seed.router';
import propertiesRouter from '../../server/api/properties/properties.router';
import rolesRouter from '../../server/api/role/role.router';
export function getRouter() {
  const router = express.Router();
  router.use('/auth', authRouter);
  router.use('/usuarios', usersRouter);
  router.use('/seed', seedRouter);
  router.use('/properties', propertiesRouter);
  router.use('/roles', rolesRouter);

  return router;
}
