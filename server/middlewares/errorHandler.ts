import {  NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { ApiError } from "./statusCode";


export function errorHandler(err:Error, req:Request, res:Response, _next:NextFunction) {
  if (err instanceof ZodError) {
    const response = new ApiError<{ _errors: string[] }>({
      statusCode: 400,
      details: 'Body invalido',
      title: "Bad Request",
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


  const response = new ApiError({
    statusCode: 500,
    title: "Error de Servidor",
    details: `Ha ocurrido un error en el endpoint ${req.method} ${req.url}`,
  });
 

  console.log(err);

  res.status(response.statusCode).json(response.getResponse());
  return;
};