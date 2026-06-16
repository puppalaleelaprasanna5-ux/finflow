import { Request, Response, NextFunction } from "express";
import { getDashboardSummary } from "../services/dashboardService";

export const getDashboardSummaryHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const summary = await getDashboardSummary(req.user.id);
    return res.status(200).json({ status: "success", data: summary });
  } catch (error) {
    next(error);
  }
};
