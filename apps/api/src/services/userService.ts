import prisma from "../prisma";
import { User } from "@prisma/client";

export const getUserByEmail = async (email: string): Promise<User | null> => {
  return prisma.user.findUnique({ where: { email } });
};

export const getUserById = async (id: string): Promise<User | null> => {
  return prisma.user.findUnique({ where: { id } });
};

export const createUser = async (email: string, password: string, name?: string): Promise<User> => {
  return prisma.user.create({
    data: { email, password, name },
  });
};
