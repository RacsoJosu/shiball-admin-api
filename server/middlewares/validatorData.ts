import { NextFunction, Request, Response } from "express";
import z from "zod";


export  function validateData(schema: z.ZodObject<any, any>) {
    
    return async (req: Request, res: Response, next: NextFunction) => {
        const values = await schema.parse(req.body)
        req.body = values
        next()
    }
    
}