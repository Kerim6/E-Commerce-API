import type { RegisterInput } from "./authTypes.ts";
import { findByEmail, create } from "./authRepository.ts";
import { ConflictError } from "../../errors/ConflictError .ts";
import { hashPassword } from "../../utils/password.ts";

export const register = async (data: RegisterInput) => {
  const existingUser = await findByEmail(data.email);

  if (existingUser) {
    throw new ConflictError("Email already exists");
  }

  const hashedPassword = await hashPassword(data.password);

  const user = await create({
    ...data,
    password: hashedPassword,
  });

  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};
