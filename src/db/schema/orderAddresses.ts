import { pgTable, uuid, timestamp, varchar } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { orders } from './orders.ts'

export const orderAddresses = pgTable('order_addresses', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id')
    .notNull()
    .references(() => orders.id)
    .unique(),
  country: varchar('country', { length: 50 }).notNull(),
  city: varchar('city', { length: 50 }).notNull(),
  street: varchar('street', { length: 100 }).notNull(),
  postalCode: varchar('postal_code', { length: 50 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const orderAddressesRelations = relations(orderAddresses, ({ one }) => ({
  order: one(orders, {
    fields: [orderAddresses.orderId],
    references: [orders.id],
  }),
}))
