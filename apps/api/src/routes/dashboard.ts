import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware";
import { getDashboardSummaryHandler } from "../controllers/dashboardController";

const router = Router();

router.use(authenticate);
router.get("/summary", getDashboardSummaryHandler);

export default router;
