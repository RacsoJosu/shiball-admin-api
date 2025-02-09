import jwt from 'jsonwebtoken';

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
        { expiresIn: '24h' }
      ),
    },
    SECRET_KEY,
    { expiresIn: '24h' }
  );
}

export function decodeJwt(token: string, firma?: string) {

  
  const key = firma || process.env.JWT_SECRET_KEY || '';
  const result = jwt.verify(token, key);

  return result
}
