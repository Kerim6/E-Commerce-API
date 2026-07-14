import {
  pgTable,
  uuid,
  timestamp,
  integer,
  text,
  unique,
  check,
} from "drizzle-orm/pg-core";
import { sql, relations } from "drizzle-orm";
import { users } from "./users.ts";
import { products } from "./products.ts";

export const reviews = pgTable(
  "reviews",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id),
    rating: integer("rating"),
    comment: text("comment"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    unique("user_product_unique").on(table.userId, table.productId),
    check(
      "rating_from_1_to_5",
      sql`${table.rating} >= 1 AND ${table.rating} <= 5`,
    ),
  ],
);

export const reviewsRelations = relations(reviews, ({ one }) => ({
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
}));
