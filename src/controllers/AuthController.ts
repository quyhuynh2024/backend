import { Request, Response } from "express";
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
  UnAuthenticatedError,
} from "../errors";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../helpers/jwt_helper";
import User from "../models/User";
import client from "../db/init_redis";

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new BadRequestError("please provide all values");
  }

  const userAlreadyExists = await User.findOne({ email });
  if (userAlreadyExists) {
    throw new BadRequestError("email already in use");
  }

  const user = await User.create({ name, email, password });
  const accessToken = await signAccessToken(user.id);
  const refreshToken = await signRefreshToken(user.id);
  res.send({ accessToken, refreshToken });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new NotFoundError("user not registered");
  }
  const isPasswordCorrect = user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new UnAuthenticatedError("email/password not valid");
  }

  const accessToken = await signAccessToken(user.id);
  const refreshToken = await signRefreshToken(user.id);

  res.send({ accessToken, refreshToken });
};

export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) throw new BadRequestError("token does not exist");
  const userId = await verifyRefreshToken(refreshToken);
  const accessToken = await signAccessToken(userId);
  const refToken = await signRefreshToken(userId);
  res.send({ accessToken, refreshToken: refToken });
};

export const logout = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) throw new BadRequestError("Invalid token");
  const userId = await verifyRefreshToken(refreshToken);
  try {
    await client.DEL(userId);
    res.sendStatus(204);
  } catch (error: any) {
    throw new InternalServerError(error.message);
  }
};
