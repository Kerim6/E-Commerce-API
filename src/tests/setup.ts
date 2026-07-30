import { sql } from 'drizzle-orm'
import { db } from '../db/connection.ts'

beforeEach(async () => {
  // Runs before every test
})

afterEach(async () => {
  // cleanup later
  await db.execute(sql`
    TRUNCATE TABLE
      addresses,
      order_addresses,
      order_items,
      orders,
      cart_items,
      carts,
      reviews,
      product_images,
      products,
      categories,
      users
    RESTART IDENTITY CASCADE;
  `)
})
