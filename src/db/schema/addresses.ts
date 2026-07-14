import {
  pgTable,
  uuid,
  timestamp,
  varchar,
  boolean,
} from "drizzle-orm/pg-core";
import { users } from "./users.ts";

export const addresses = pgTable("addresses", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  country: varchar("country", { length: 50 }),
  city: varchar("city", { length: 50 }),
  street: varchar("street", { length: 100 }),
  postalCode: varchar("postal_code", { length: 50 }),
  isDefault: boolean("is_default").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
