import {
  pgTable,
  uuid,
  pgEnum,
  numeric,
  timestamp,
  doublePrecision,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { users } from './users.ts'
import { orderItems } from './orderItems.ts'
import { orderAddresses } from './orderAddresses.ts'

export const orderStatusEnum = pgEnum('order_statusEnum', [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
])

export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id)
    .notNull(),
  status: orderStatusEnum('status').default('pending').notNull(),
  totalPrice: doublePrecision('total_price').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
  address: one(orderAddresses),
}))
