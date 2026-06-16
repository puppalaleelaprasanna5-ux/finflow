import { Router } from "express";
import {
  createTransactionHandler,
  deleteTransactionHandler,
  listTransactions,
  updateTransactionHandler,
} from "../controllers/transactionController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.use(authenticate);
router.get("/", listTransactions);
router.post("/", createTransactionHandler);
router.put("/:id", updateTransactionHandler);
router.delete("/:id", deleteTransactionHandler);

export default router;
