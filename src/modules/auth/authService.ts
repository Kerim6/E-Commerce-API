import type { loginInput, RegisterInput } from "./authTypes.ts";
import { findByEmail, create } from "./authRepository.ts";
import { ConflictError } from "../../errors/ConflictError .ts";
import { UnauthorizedError } from "../../errors/UnauthorizedError.ts";
import { hashPassword, comparePasswords } from "../../utils/password.ts";
import { generateToken } from "../../utils/jwt.ts";

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

  const token = await generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  const { password, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
};

export const login = async (data: loginInput) => {
  const existingUser = await findByEmail(data.email);

  if (!existingUser) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const passwordMatch = await comparePasswords(
    data.password,
    existingUser.password,
  );

  if (!passwordMatch) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const token = await generateToken({
    id: existingUser.id,
    email: existingUser.email,
    role: existingUser.role,
  });

  const { password, ...userWithoutPassowrd } = existingUser;
  return { existingUser: userWithoutPassowrd, token };
};
