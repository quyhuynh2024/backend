import { Request, Response, NextFunction } from "express";

export function logger(req: Request, res: Response, next: NextFunction) {
  res.on("finish", function () {
    console.log(
      new Date(req.timestamp as number),
      req.header("x-forwarded-for") || req.socket.remoteAddress,
      req.method,
      decodeURI(req.url),
      res.statusCode,
      res.statusMessage
    );
  });
  next();
}
