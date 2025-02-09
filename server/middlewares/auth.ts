import { NextFunction, Request, Response } from 'express';
import { ApiError } from './statusCode';
import { decodeJwt } from '../shared/libs/jwt';
import { prisma } from '../config/prisma';
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


   
  const decodeAuth = decodeJwt(token) as UserPayload;

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
  const userTokenDecode = decodeJwt(decodeAuth.tokenUser, user?.userSecret) as UserTokenPayload;

    
    req.user = {
        id: user.id,
        email: userTokenDecode.email,
        role: userTokenDecode.role
    }

    next()
}
