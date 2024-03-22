import { Request, Response, NextFunction } from "express";

export function logger(req: Request, res: Response, next: NextFunction) {
  res.on("finish", function () {
    console.log(
      req.timestamp,
      req.method,
      decodeURI(req.url),
      res.statusCode,
      res.statusMessage
    );
  });
  next();
}
