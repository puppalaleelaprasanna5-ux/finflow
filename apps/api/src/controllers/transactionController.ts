import { Request, Response, NextFunction } from "express";
import {
  createTransaction,
  deleteTransaction,
  getTransactionsByUserId,
  updateTransaction,
  TransactionCreateData,
} from "../services/transactionService";
import { TransactionType } from "@prisma/client";

const parseBody = (body: any): TransactionCreateData => {
  const { title, amount, category, type, notes, date } = body;

  if (!title || typeof title !== "string") {
    throw new Error("Title is required");
  }

  if (typeof amount !== "number") {
    throw new Error("Amount must be a number");
  }

  if (!category || typeof category !== "string") {
    throw new Error("Category is required");
  }

  if (!type || ![TransactionType.INCOME, TransactionType.EXPENSE].includes(type)) {
    throw new Error("Type must be INCOME or EXPENSE");
  }

  const parsedDate = date ? new Date(date) : new Date();
  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error("Invalid date");
  }

  return {
    title,
    amount,
    category,
    type,
    notes: typeof notes === "string" ? notes : null,
    date: parsedDate,
  };
};

export const listTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const transactions = await getTransactionsByUserId(req.user.id);
    return res.status(200).json({ status: "success", data: transactions });
  } catch (error) {
    next(error);
  }
};

export const createTransactionHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const payload = parseBody(req.body);
    const transaction = await createTransaction(req.user.id, payload);
    return res.status(201).json({ status: "success", data: transaction });
  } catch (error) {
    next(error);
  }
};

export const updateTransactionHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const transactionId = req.params.id;
    const payload = parseBody(req.body);
    const transaction = await updateTransaction(req.user.id, transactionId, payload);

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    return res.status(200).json({ status: "success", data: transaction });
  } catch (error) {
    next(error);
  }
};

export const deleteTransactionHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const transactionId = req.params.id;
    const transaction = await deleteTransaction(req.user.id, transactionId);

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    return res.status(200).json({ status: "success", data: transaction });
  } catch (error) {
    next(error);
  }
};
