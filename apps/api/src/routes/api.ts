import { Router } from "express";
import authRouter from "./auth";
import transactionRouter from "./transactions";
import { getHealth } from "../controllers/healthController";

const router = Router();

router.use("/auth", authRouter);
router.use("/transactions", transactionRouter);
router.get("/health", getHealth);

export default router;
