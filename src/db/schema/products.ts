import {
  pgTable,
  uuid,
  varchar,
  text,
  decimal,
  integer,
  timestamp,
  check,
} from 'drizzle-orm/pg-core'
import { sql, relations } from 'drizzle-orm'
import { categories } from './categories.ts'
import { productImages } from './product_images.ts'
import { cartItems } from './cartItems.ts'
import { orderItems } from './orderItems.ts'
import { reviews } from './reviews.ts'

export const products = pgTable(
  'products',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 100 }).notNull().unique(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    description: text('description'),
    price: decimal('price', { precision: 10, scale: 2 }).notNull(),
    stock: integer('stock').notNull(),
    categoryId: uuid('category_id')
      .references(() => categories.id)
      .notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },

  (table) => [
    check('price_non_negative_check', sql`${table.price} >=0`),
    check('stock_non_negative_check', sql`${table.stock} >=0`),
  ],
)

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  images: many(productImages),
  cartItems: many(cartItems),
  orderItems: many(orderItems),
  reviews: many(reviews),
}))
