import prisma from "../prisma";

export type GoalCreateData = {
  title: string;
  target: number;
  current?: number;
  deadline?: Date | null;
};

export type GoalUpdateData = Partial<GoalCreateData>;

export const getGoalsByUserId = async (userId: string) => {
  return prisma.goal.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });
};

export const createGoal = async (userId: string, data: GoalCreateData) => {
  return prisma.goal.create({
    data: {
      ...data,
      current: data.current ?? 0,
      userId,
    },
  });
};

export const updateGoal = async (
  userId: string,
  goalId: string,
  data: GoalUpdateData
) => {
  const goal = await prisma.goal.findUnique({
    where: { id: goalId },
  });

  if (!goal || goal.userId !== userId) {
    return null;
  }

  return prisma.goal.update({
    where: { id: goalId },
    data,
  });
};

export const deleteGoal = async (userId: string, goalId: string) => {
  const goal = await prisma.goal.findUnique({
    where: { id: goalId },
  });

  if (!goal || goal.userId !== userId) {
    return null;
  }

  await prisma.goal.delete({
    where: { id: goalId },
  });

  return goal;
};
