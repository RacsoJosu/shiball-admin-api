import { NextFunction, Request, Response } from "express";
interface ErrorResponse {
  status?: number;
  message: string;
  stack?: string;
}


export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    
    console.error("❌ Error:", err);
    const statusCode = res.statusCode || 500;
    const error: ErrorResponse = {
        message: err.message,
        stack: err.stack,
        status: statusCode,

    }
    if (process.env.NODE_ENV === "development") {
        error.stack = err.stack;
  }
    res.status(500).json({ error: err.message });
}