import { Request, Response, NextFunction } from "express";
import { loginUser, registerUser } from "../services/authService";

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const result = await registerUser(email, password, name);
    return res.status(201).json({ status: "success", data: result });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const result = await loginUser(email, password);
    return res.status(200).json({ status: "success", data: result });
  } catch (error) {
    next(error);
  }
};

export const me = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    return res.status(200).json({ status: "success", data: req.user });
  } catch (error) {
    next(error);
  }
};
