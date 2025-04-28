import expressApp from '../server.index';
import { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  return expressApp(req, res);
}
