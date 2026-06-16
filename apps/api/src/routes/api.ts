import { Router } from "express";
import authRouter from "./auth";
import { getHealth } from "../controllers/healthController";

const router = Router();

router.use("/auth", authRouter);
router.get("/health", getHealth);

export default router;
