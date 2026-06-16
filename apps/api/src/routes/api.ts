import { Router } from "express";
import authRouter from "./auth";
import transactionRouter from "./transactions";
import goalRouter from "./goals";
import { getHealth } from "../controllers/healthController";

const router = Router();

router.use("/auth", authRouter);
router.use("/transactions", transactionRouter);
router.use("/goals", goalRouter);
router.get("/health", getHealth);

export default router;
