import { Sema } from 'async-sema';
import { Request, Response, NextFunction } from 'express';
import logger from './logger/config';
import { ApiError } from './middlewares/statusCode';

const maxConcurrentRequests = parseInt(
  process.env.MAX_CONCURRENT_REQUESTS ?? '20',
  10
);
const maxQueue = parseInt(process.env.MAX_QUEUE ?? '50', 10);
const requestSema = new Sema(maxConcurrentRequests, {
  capacity: 100,
});

export async function concurrencyLimiter(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log('➡️  Esperando slot...', requestSema.nrWaiting());

  if (requestSema.nrWaiting() > maxQueue) {
    logger.warn('Alta concurrencia detectada');
    throw new ApiError({
      statusCode: 503,
      data: null,
      success: false,
      title: 'Servidor saturado intentelo mas tarde',
      details: 'Servidor saturado intentelo mas tarde',
    });
  }
  await requestSema.acquire();

  console.log('✅ Slot adquirido');

  const release = () => {
    console.log('🔓 Slot liberado');
    requestSema.release();
  };

  res.once('finish', release);
  res.once('close', release);

  next();
}
