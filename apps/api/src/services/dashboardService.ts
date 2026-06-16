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
  categoryTotals?: Array<{ category: string; amount: number }>;
  monthlyTrend?: Array<{ month: string; income: number; expenses: number }>;
};

export const getDashboardSummary = async (userId: string): Promise<DashboardSummary> => {
  // recent items
  const recentTransactions = await prisma.transaction.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    take: 5,
  });

  const recentGoals = await prisma.goal.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    take: 5,
  });

  // aggregates
  const [incomeAggregate, expensesAggregate, savingsAggregate, targetAggregate] = await Promise.all([
    prisma.transaction.aggregate({ where: { userId, type: "INCOME" }, _sum: { amount: true } }),
    prisma.transaction.aggregate({ where: { userId, type: "EXPENSE" }, _sum: { amount: true } }),
    prisma.goal.aggregate({ where: { userId }, _sum: { current: true } }),
    prisma.goal.aggregate({ where: { userId }, _sum: { target: true } }),
  ]);

  // transactions for charts: last 12 months
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - 11, 1);
  const transactionsInRange = await prisma.transaction.findMany({
    where: { userId, date: { gte: start } },
    orderBy: { date: "desc" },
  });

  const income = incomeAggregate._sum.amount ?? 0;
  const expenses = expensesAggregate._sum.amount ?? 0;
  const balance = income - expenses;

  const totalGoalCurrent = savingsAggregate._sum.current ?? 0;
  const totalGoalTarget = targetAggregate._sum.target ?? 0;
  const goalProgress = totalGoalTarget > 0 ? Math.round((totalGoalCurrent / totalGoalTarget) * 100) : 0;

  // category totals (expenses only)
  const categoryMap: Record<string, number> = {};
  transactionsInRange.forEach((t) => {
    if (t.type === "EXPENSE") {
      const cat = t.category || "Uncategorized";
      categoryMap[cat] = (categoryMap[cat] || 0) + t.amount;
    }
  });

  const categoryTotals = Object.entries(categoryMap).map(([category, amount]) => ({ category, amount }));

  // monthly trend for last 12 months
  const monthMap: Record<string, { income: number; expenses: number }> = {};
  for (let i = 0; i < 12; i++) {
    const d = new Date(start.getFullYear(), start.getMonth() + i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    monthMap[key] = { income: 0, expenses: 0 };
  }

  transactionsInRange.forEach((t) => {
    const d = new Date(t.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (!monthMap[key]) monthMap[key] = { income: 0, expenses: 0 };
    if (t.type === "INCOME") monthMap[key].income += t.amount;
    if (t.type === "EXPENSE") monthMap[key].expenses += t.amount;
  });

  const monthlyTrend = Object.keys(monthMap)
    .sort()
    .map((month) => ({ month, income: monthMap[month].income, expenses: monthMap[month].expenses }));

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
    categoryTotals,
    monthlyTrend,
  };
};
