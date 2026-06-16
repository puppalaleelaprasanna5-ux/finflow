import { comparePassword, hashPassword } from "../utils/hash";
import { signJwt, verifyJwt } from "../utils/jwt";
import { createUser, getUserByEmail } from "./userService";

export const registerUser = async (email: string, password: string, name?: string) => {
  const existing = await getUserByEmail(email);
  if (existing) {
    throw new Error("Email already in use");
  }

  const hashedPassword = await hashPassword(password);
  const user = await createUser(email, hashedPassword, name);
  const token = signJwt({ userId: user.id, email: user.email });

  return { user: { id: user.id, email: user.email, name: user.name }, token };
};

export const loginUser = async (email: string, password: string) => {
  const user = await getUserByEmail(email);
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const valid = await comparePassword(password, user.password);
  if (!valid) {
    throw new Error("Invalid credentials");
  }

  const token = signJwt({ userId: user.id, email: user.email });
  return { user: { id: user.id, email: user.email, name: user.name }, token };
};

export const getUserFromToken = async (token: string) => {
  return verifyJwt<{ userId: string; email: string }>(token);
};
