import { NextFunction, Request, Response } from "express";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(err.stack);
  const defaultError = {
    statusCode: err.statusCode || 500,
    message: err.message || "Something went wrong, try again later",
  };
  
  res.status(defaultError.statusCode).json({ message: defaultError.message });
}
