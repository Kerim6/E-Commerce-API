import { pgTable, uuid, pgEnum, numeric, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users.ts";

const statusEnum = pgEnum("statusEnum", [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
]);

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  status: statusEnum("status").default("pending").notNull(),
  totalPrice: numeric("total_price").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
