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
  /* if (err.name === "ValidationError") {
    defaultError.statusCode = StatusCodes.BAD_REQUEST;
    defaultError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(",");
  }
  if (err.code && err.code === 11000) {
    defaultError.statusCode = StatusCodes.BAD_REQUEST;
    defaultError.msg = `${Object.keys(err.keyValue)} field has to be unique`;
  } */
  res.status(defaultError.statusCode).json({ message: defaultError.message });
}
