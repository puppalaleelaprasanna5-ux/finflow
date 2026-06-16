import jwt from "jsonwebtoken";
import config from "../config";

const secret = config.jwtSecret as string;

export const signJwt = (payload: object) => {
  return jwt.sign(payload as string | object | Buffer, secret, {
    expiresIn: config.jwtExpiresIn,
  } as jwt.SignOptions);
};

export const verifyJwt = <T extends object>(token: string): T => {
  return jwt.verify(token, secret) as T;
};
