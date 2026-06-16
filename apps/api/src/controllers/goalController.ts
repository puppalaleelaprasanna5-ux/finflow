import { Request, Response, NextFunction } from "express";
import {
  createGoal,
  deleteGoal,
  getGoalsByUserId,
  updateGoal,
  GoalCreateData,
} from "../services/goalService";

const parseGoalBody = (body: any): GoalCreateData => {
  const { title, target, current, deadline } = body;

  if (!title || typeof title !== "string") {
    throw new Error("Title is required");
  }

  if (typeof target !== "number" || target <= 0) {
    throw new Error("Target must be a positive number");
  }

  const parsedCurrent = typeof current === "number" ? current : 0;
  if (parsedCurrent < 0) {
    throw new Error("Current must be a non-negative number");
  }

  let parsedDeadline: Date | null = null;
  if (deadline) {
    const date = new Date(deadline);
    if (Number.isNaN(date.getTime())) {
      throw new Error("Invalid deadline");
    }
    parsedDeadline = date;
  }

  return {
    title,
    target,
    current: parsedCurrent,
    deadline: parsedDeadline,
  };
};

export const listGoals = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const goals = await getGoalsByUserId(req.user.id);
    return res.status(200).json({ status: "success", data: goals });
  } catch (error) {
    next(error);
  }
};

export const createGoalHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const payload = parseGoalBody(req.body);
    const goal = await createGoal(req.user.id, payload);
    return res.status(201).json({ status: "success", data: goal });
  } catch (error) {
    next(error);
  }
};

export const updateGoalHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const goalId = req.params.id;
    const payload = parseGoalBody(req.body);
    const goal = await updateGoal(req.user.id, goalId, payload);

    if (!goal) {
      return res.status(404).json({ error: "Goal not found" });
    }

    return res.status(200).json({ status: "success", data: goal });
  } catch (error) {
    next(error);
  }
};

export const deleteGoalHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const goalId = req.params.id;
    const goal = await deleteGoal(req.user.id, goalId);

    if (!goal) {
      return res.status(404).json({ error: "Goal not found" });
    }

    return res.status(200).json({ status: "success", data: goal });
  } catch (error) {
    next(error);
  }
};
