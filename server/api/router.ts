import express from 'express';

import usersRouter from '../../server/api/users/users.router';
import authRouter from '../../server/api/auth/auth.router';
import seedRouter from '../../server/api/seed/seed.router';

export function getRouter() {
  const router = express.Router();
  router.use('/auth', authRouter);
  router.use('/usuarios', usersRouter);
  router.use('/seed', seedRouter);

  return router;
}
