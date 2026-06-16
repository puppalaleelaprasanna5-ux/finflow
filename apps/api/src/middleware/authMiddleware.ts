import { NextFunction, Request, Response } from "express";
import { verifyJwt } from "../utils/jwt";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = verifyJwt<{ userId: string; email: string }>(token);
    req.user = { id: payload.userId, email: payload.email };
    next();
  } catch {
    return res.status(401).json({ error: "Unauthorized" });
  }
};
