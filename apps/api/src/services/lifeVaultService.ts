import prisma from "../prisma";

export type LifeVaultCreateData = {
  title: string;
  description?: string;
  category: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
  filePath: string;
};

export const getLifeVaultByUserId = async (userId: string) => {
  return prisma.lifeVault.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

export const createLifeVaultEntry = async (
  userId: string,
  data: LifeVaultCreateData
) => {
  return prisma.lifeVault.create({
    data: {
      ...data,
      userId,
    },
  });
};

export const deleteLifeVaultEntry = async (userId: string, documentId: string) => {
  const document = await prisma.lifeVault.findUnique({
    where: { id: documentId },
  });

  if (!document || document.userId !== userId) {
    return null;
  }

  await prisma.lifeVault.delete({
    where: { id: documentId },
  });

  return document;
};
