import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { ApiError } from './statusCode';
import { JsonWebTokenError } from 'jsonwebtoken';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof ZodError) {
    const response = new ApiError<{ _errors: string[] }>({
      title: 'Bad Request',
      details: 'Body invalido',
      statusCode: 400,
      success: false,
      data: err.format(),
    });

    res.status(response.statusCode).json(response.getResponse());
    return;
  }

  if (err instanceof ApiError) {
    res.status(err.statusCode).json(err.getResponse());
    return;
  }

  if (err instanceof JsonWebTokenError) {
    const response = new ApiError({
      title: 'Unathorized',
      details: err.message,
      statusCode: 401,
      success: false,
    });

    console.error(response.stack);
    delete response.stack;

    res.status(response.statusCode).json(response.getResponse());
    return;
  }

  const response = new ApiError({
    statusCode: 500,
    title: 'Error de Servidor',
    details: `Ha ocurrido un error en el endpoint ${req.method} ${req.url}`,
  });

  console.log(err);

  res
    .status(response.statusCode)
    .json({ ...err, details: response.details, title: response.title });
}
