import jwt, { JwtPayload } from 'jsonwebtoken';
import { ApiError } from '../../middlewares/statusCode';

const SECRET_KEY = process.env.JWT_SECRET_KEY || '';

type SignUserJwt = {
  id: string;
  email: string;
  userSecret: string;
  role: string;
};

export function signJwtUser(user: SignUserJwt) {
  return jwt.sign(
    {
      id: user.id,
      tokenUser: jwt.sign(
        {
          role: user.role,
          email: user.email,
        },
        user.userSecret,
        { expiresIn: '7d' }
      ),
    },
    SECRET_KEY,
    { expiresIn: '7d' }
  );
}

export function decodeJwt(token: string, firma?: string): JwtPayload {

  
  const key = firma || process.env.JWT_SECRET_KEY || '';
  const result = jwt.verify(token, key);

  if (typeof result === "string") {
    throw new ApiError({
      statusCode: 400,
      details: "token no es valido",
      title: "Token no es valido"
    })
    
  }

  return result
}
