import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config";
import client from "../db/init_redis";
import { InternalServerError, UnAuthenticatedError } from "../errors";

export async function signAccessToken(userId: string): Promise<string> {
  try {
    const accessToken: string = jwt.sign({}, config.access_token_secret, {
      expiresIn: config.access_token_lifetime,
      audience: userId,
    });
    return accessToken;
  } catch (error: any) {
    throw new InternalServerError(error.message);
  }
}

export async function signRefreshToken(userId: string): Promise<string> {
  try {
    const refreshToken: string = jwt.sign({}, config.refresh_token_secret, {
      expiresIn: config.refresh_token_lifetime,
      audience: userId,
    });
    await client.SET(userId, refreshToken);
    await client.EXPIRE(userId, 365 * 24 * 60 * 60); // 1 year
    return refreshToken;
  } catch (error: any) {
    throw new InternalServerError(error.message);
  }
}

interface JwtPayload {
  aud: string;
}

export async function verifyRefreshToken(refreshToken: string) {
  let decoded: JwtPayload;
  try {
    decoded = jwt.verify(
      refreshToken,
      config.refresh_token_secret
    ) as JwtPayload;
  } catch (error: any) {
    throw new UnAuthenticatedError(error.message);
  }
  try {
    const userId: string = decoded.aud;
    const result: string | null = await client.GET(userId);
    if (result === refreshToken) {
      return userId;
    } else {
      throw new InternalServerError("Invalid token");
    }
  } catch (error: any) {
    throw new InternalServerError(error.message);
  }
}

export const verifyAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers["authorization"]) {
    throw new UnAuthenticatedError("No authorization token was found");
  }
  const authHeader = req.headers["authorization"];
  const bearerToken = authHeader.split(" ");
  const token = bearerToken[1];

  try {
    const payload = jwt.verify(token, config.access_token_secret);
    req.payload = payload;
    next();
  } catch (error: any) {
    const message =
      error.name === "JsonWebTokenError" ? "Unauthorized" : error.message;
    throw new UnAuthenticatedError(message);
  }
};
