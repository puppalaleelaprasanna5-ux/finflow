import { Request, Response } from "express";
import { getHealthStatus } from "../services/healthService";

export const getHealth = (_req: Request, res: Response) => {
  const health = getHealthStatus();

  return res.json({
    status: "success",
    data: health,
  });
};
