import 'reflect-metadata';
import './types/bigint-json';
import express, { Express, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { v4 as uuidv4 } from 'uuid';
import { prismaConnect } from '../server/config/db';
import { errorHandler } from '../server/middlewares/errorHandler';
import { getRouter } from '../server/api/router';
import logger from './logger/config';
morgan.token('traceId', (req: Request) => req.traceId ?? 'NoTrace');
morgan.token('userId', (req: Request) => req.user?.id ?? 'Anonymous');
morgan.token('remote-addr', (req: Request) => req.ip ?? 'NoIP');

dotenv.config();
const customFormat = function (
  tokens: Record<any, any>,
  req: Request,
  res: Response
) {
  const date =
    typeof tokens.date === 'function' ? tokens.date(req, res, 'clf') : '';
  const method =
    typeof tokens.method === 'function' ? tokens.method(req, res) : '';
  const url = typeof tokens.url === 'function' ? tokens.url(req, res) : '';
  const status =
    typeof tokens.status === 'function' ? tokens.status(req, res) : '';
  const responseTime =
    typeof tokens['response-time'] === 'function'
      ? tokens['response-time'](req, res)
      : '';
  const userId =
    typeof tokens.userId === 'function' ? tokens.userId(req, res) : '';
  const traceId =
    typeof tokens.traceId === 'function' ? tokens.traceId(req, res) : '';
  const ip =
    typeof tokens['remote-addr'] === 'function'
      ? tokens['remote-addr'](req, res)
      : '';

  return `[${date}] info: [${method}] ${url} ${status} - ${responseTime} ms - userId: ${userId} - traceId: ${traceId} - ip: ${ip}`;
};
const app: Express = express();

const PORT = process.env.PORT ?? 3001;
app.use(
  cors({
    credentials: true,
    origin: [
      'https://shinball-fronted.vercel.app',
      'http://localhost:3000',
      'https://shinball-fronted-git-dev-oscarvallecillos-projects.vercel.app',
      'https://shinball-fronted-git-main-oscarvallecillos-projects.vercel.app',
      'https://14nq1k5k-3000.use.devtunnels.ms',
    ],
  })
);
app.use(
  morgan(customFormat, {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(
  '/api',

  function (req: Request, _res: Response, next: NextFunction) {
    req.traceId = uuidv4();
    next();
  },
  getRouter()
);
app.get('/test', (req, res) => {
  res.json({ message: 'Ruta de prueba funcionando' });
});

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});
app.use(errorHandler);

(async () => {
  await prismaConnect();
})();
app.listen(PORT, () => {
  logger.info(`[SERVER RUNNING] en el puerto ${PORT}`);
});
export default app;
