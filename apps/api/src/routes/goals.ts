import { Router } from "express";
import {
  createGoalHandler,
  deleteGoalHandler,
  listGoals,
  updateGoalHandler,
} from "../controllers/goalController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.use(authenticate);
router.get("/", listGoals);
router.post("/", createGoalHandler);
router.put("/:id", updateGoalHandler);
router.delete("/:id", deleteGoalHandler);

export default router;
