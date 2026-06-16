import prisma from "../prisma";

export type DashboardSummary = {
  balance: number;
  income: number;
  expenses: number;
  savings: number;
  goalProgress: number;
  recentTransactions: Array<{
    id: string;
    title: string;
    amount: number;
    category: string;
    type: string;
    notes: string | null;
    date: string;
  }>;
  recentGoals: Array<{
    id: string;
    title: string;
    target: number;
    current: number;
    deadline: string | null;
    progress: number;
  }>;
};

export const getDashboardSummary = async (userId: string): Promise<DashboardSummary> => {
  const [recentTransactions, recentGoals, incomeAggregate, expensesAggregate, savingsAggregate, targetAggregate] =
    await Promise.all([
      prisma.transaction.findMany({
        where: { userId },
        orderBy: { date: "desc" },
        take: 5,
      }),
      prisma.goal.findMany({
        where: { userId },
        orderBy: { updatedAt: "desc" },
        take: 5,
      }),
      prisma.transaction.aggregate({
        where: { userId, type: "INCOME" },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: { userId, type: "EXPENSE" },
        _sum: { amount: true },
      }),
      prisma.goal.aggregate({
        where: { userId },
        _sum: { current: true },
      }),
      prisma.goal.aggregate({
        where: { userId },
        _sum: { target: true },
      }),
    ]);

  const income = incomeAggregate._sum.amount ?? 0;
  const expenses = expensesAggregate._sum.amount ?? 0;
  const balance = income - expenses;

  const totalGoalCurrent = savingsAggregate._sum.current ?? 0;
  const totalGoalTarget = targetAggregate._sum.target ?? 0;
  const goalProgress = totalGoalTarget > 0 ? Math.round((totalGoalCurrent / totalGoalTarget) * 100) : 0;

  return {
    balance,
    income,
    expenses,
    savings: totalGoalCurrent,
    goalProgress,
    recentTransactions: recentTransactions.map((transaction) => ({
      id: transaction.id,
      title: transaction.title,
      amount: transaction.amount,
      category: transaction.category,
      type: transaction.type,
      notes: transaction.notes,
      date: transaction.date.toISOString(),
    })),
    recentGoals: recentGoals.map((goal) => ({
      id: goal.id,
      title: goal.title,
      target: goal.target,
      current: goal.current,
      deadline: goal.deadline ? goal.deadline.toISOString() : null,
      progress: goal.target > 0 ? Math.min(100, Math.round((goal.current / goal.target) * 100)) : 0,
    })),
  };
};
