import { Router } from "express";
import authRouter from "./auth";
import transactionRouter from "./transactions";
import goalRouter from "./goals";
import dashboardRouter from "./dashboard";
import { getHealth } from "../controllers/healthController";

const router = Router();

router.use("/auth", authRouter);
router.use("/transactions", transactionRouter);
router.use("/goals", goalRouter);
router.use("/dashboard", dashboardRouter);
router.get("/health", getHealth);

export default router;
