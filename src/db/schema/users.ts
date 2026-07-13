import { pgTable, uuid, varchar, timestamp, pgEnum } from "drizzle-orm/pg-core";

const roleEnum = pgEnum("role", ["admin", "user"]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 50 }).unique().notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  role: roleEnum("role").default("user").notNull(),
  firstName: varchar("first_name", { length: 50 }),
  lastName: varchar("last_name", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
