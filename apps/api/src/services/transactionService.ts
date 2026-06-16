import { TransactionType } from "@prisma/client";
import prisma from "../prisma";

export type TransactionCreateData = {
  title: string;
  amount: number;
  category: string;
  type: TransactionType;
  notes?: string | null;
  date: Date;
};

export type TransactionUpdateData = Partial<TransactionCreateData>;

export const getTransactionsByUserId = async (userId: string) => {
  return prisma.transaction.findMany({
    where: { userId },
    orderBy: { date: "desc" },
  });
};

export const createTransaction = async (
  userId: string,
  data: TransactionCreateData
) => {
  return prisma.transaction.create({
    data: {
      ...data,
      userId,
    },
  });
};

export const updateTransaction = async (
  userId: string,
  transactionId: string,
  data: TransactionUpdateData
) => {
  const transaction = await prisma.transaction.findUnique({
    where: { id: transactionId },
  });

  if (!transaction || transaction.userId !== userId) {
    return null;
  }

  return prisma.transaction.update({
    where: { id: transactionId },
    data,
  });
};

export const deleteTransaction = async (userId: string, transactionId: string) => {
  const transaction = await prisma.transaction.findUnique({
    where: { id: transactionId },
  });

  if (!transaction || transaction.userId !== userId) {
    return null;
  }

  await prisma.transaction.delete({
    where: { id: transactionId },
  });

  return transaction;
};
