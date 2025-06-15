import { NextFunction, Request, Response } from 'express';
import { ApiError } from './statusCode';
import { decodeJwt, signJwtUser } from '../../server/shared/libs/jwt';
import { prisma } from '../../server/config/db';
import dayjs from 'dayjs';

export async function authGuard(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let token = null;

  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else {
    token = req.cookies.AUTH_TOKEN;
  }
  if (!token) {
    throw new ApiError({
      statusCode: 401,
      title: 'No autorizado',
      details: 'Sesión expirada. Vuelve a iniciar sesión.',
      data: req.cookies,
    });
  }

  const decodeAuth = decodeJwt(token);

  if (!decodeAuth.id) {
    throw new ApiError({
      statusCode: 401,
      title: 'No autorizado',
      details: 'Sesión expirada. Vuelve a iniciar sesión.',
      data: req.cookies,
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      id: decodeAuth.id,
    },
  });

  if (!user) {
    throw new ApiError({
      statusCode: 404,
      title: 'Usuario no encontrado',
      details: 'Usuario no existe',
    });
  }
  const userTokenDecode = decodeJwt(decodeAuth.tokenUser, user?.userSecret);

  req.user = {
    id: user.id,
    email: userTokenDecode.email,
    role: userTokenDecode.role,
  };

  const now = dayjs();
  const tokenExp = dayjs.unix(decodeAuth.exp ?? 0);
  const threeDaysLater = now.add(3, 'days');

  let newToken = null;
  if (tokenExp.isBefore(threeDaysLater)) {
    req.user.token = signJwtUser({
      email: req.user.email,
      role: req.user.role,
      id: req.user.id,
      userSecret: user?.userSecret,
    });
    res.cookie('AUTH_TOKEN', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 604800000,
    });
  }

  next();
}
