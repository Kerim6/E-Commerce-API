import { eq } from "drizzle-orm";
import { db } from "../../db/connection.ts";
import { users } from "../../db/schema/index.ts";
import type { NewUser } from "../../db/schema/users.ts";

export const findByEmail = async (email: string) => {
  return db.query.users.findFirst({
    where: eq(users.email, email),
  });
};

export const create = async (user: Omit<NewUser, "role">) => {
  const [createdUser] = await db.insert(users).values(user).returning();
  return createdUser;
};
