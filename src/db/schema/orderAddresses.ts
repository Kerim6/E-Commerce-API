import { pgTable, uuid, timestamp, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { orders } from "./orders.ts";

export const orderAddresses = pgTable("order_addresses", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id),
  country: varchar("country", { length: 50 }),
  city: varchar("city", { length: 50 }),
  street: varchar("street", { length: 100 }),
  postalCode: varchar("postal_code", { length: 50 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const orderAddressesRelations = relations(orderAddresses, ({ one }) => ({
  order: one(orders, {
    fields: [orderAddresses.orderId],
    references: [orders.id],
  }),
}));
