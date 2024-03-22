import express, { Application, Request, Response } from "express";
import {
  addTimestamp,
  errorHandler,
  logger,
  notFoundMiddleware,
} from "./middlewares";
import "express-async-errors";
import config from "./config";

// connect db
import "./db/init_mongodb";
import "./db/init_redis";
// route
import AuthRouter from "./routes/AuthRoute";
import { verifyAccessToken } from "./helpers/jwt_helper";

const app: Application = express();
app.use(express.json());

app.use(addTimestamp);
app.use(logger);

app.get("/", verifyAccessToken, (req: Request, res: Response) => {
  res.send({ message: "OK", timestamp: req.timestamp, payload: req.payload });
});

app.use(`/${config.prefix}/auth`, AuthRouter);

app.use(notFoundMiddleware);
app.use(errorHandler);

const PORT = 5001;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
