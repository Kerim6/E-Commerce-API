import { pgTable, uuid, integer, check, unique } from "drizzle-orm/pg-core";
import { carts } from "./carts.ts";
import { products } from "./products.ts";
import { sql, relations } from "drizzle-orm";

export const cartItems = pgTable(
  "cart_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    cartId: uuid("cart_id")
      .references(() => carts.id)
      .notNull(),
    productId: uuid("product_id")
      .references(() => products.id)
      .notNull(),
    quantity: integer("quantity").notNull(),
  },
  (table) => [
    check("quantity_non_negative", sql`${table.quantity} >0`),
    unique("cart_product_unique").on(table.cartId, table.productId),
  ],
);

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, {
    fields: [cartItems.cartId],
    references: [carts.id],
  }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
}));
