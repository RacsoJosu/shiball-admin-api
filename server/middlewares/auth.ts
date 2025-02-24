import { NextFunction, Request, Response } from 'express';
import { ApiError } from './statusCode';
import { decodeJwt, signJwtUser } from '../shared/libs/jwt';
import { prisma } from '../config/prisma';
import dayjs from 'dayjs';
// import '../types/express';
interface UserPayload {
  id: string;
  tokenUser: string;
}
interface UserTokenPayload {
  role: string;
  email: string;
}
export async function authGuard(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies.ACCESS_TOKEN;

  if (!token) {
    throw new ApiError({
      statusCode: 401,
      title: 'No autorizado',
      details: 'Token no encontrado',
    });
  }

  const decodeAuth = decodeJwt(token);

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
  const tokenExp = dayjs.unix(decodeAuth.exp || 0);
  const threeDaysLater = now.add(3, 'days');

  let newToken = null;
  if (tokenExp.isBefore(threeDaysLater)) {
    req.user.token = signJwtUser({
      email: req.user.email,
      role: req.user.role,
      id: req.user.id,
      userSecret: user?.userSecret,
    });
    res.cookie('ACCESS_TOKEN', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge:  604800000,
    });
  }

  next();
}
