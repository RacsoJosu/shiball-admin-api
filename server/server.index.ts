import 'reflect-metadata';
import './types/express.d.ts';
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import { prismaConnect } from '../server/config/db';
import { errorHandler } from '../server/middlewares/errorHandler';
import { getRouter } from '../server/api/router';

dotenv.config();

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
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api', getRouter());
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
  console.log(`Server is running on port ${PORT}`);
});
export default app;
