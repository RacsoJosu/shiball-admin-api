import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'
import { prismaConnect } from './config/prisma';
import { errorHandler } from './middlewares/errorHandler';
import { getRouter } from './api/router';


dotenv.config();

const app: Express = express();

const PORT = process.env.PORT || 3001;
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use('/api', getRouter());
app.get('/test', (req, res) => {
  res.json({ message: 'Ruta de prueba funcionando' });
});

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});
app.use(errorHandler);

prismaConnect();
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
