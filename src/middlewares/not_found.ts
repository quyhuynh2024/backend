import { Request, Response } from "express";

export function notFoundMiddleware(req: Request, res: Response) {
  res.status(404).send("routes does not exist");
}
