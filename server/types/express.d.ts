import { Request } from 'express';

interface UserContext {
  id: string;
  email: string;
  role: string;
  token?: string;
}
declare global {
  namespace Express {
    interface Request {
      user?: UserContext; // Añades la propiedad 'user' que puede ser un UserPayload
    }
  }
  interface BigInt {
    toJSON(): string;
  }
}
