import { createInsertSchema } from 'drizzle-zod'
import { carts } from '../../db/schema/carts.ts'
import { uuid, z } from 'zod'

export const cartCreateSchema = createInsertSchema(carts)
export const cartUpdateSchema = cartCreateSchema.partial()

export const addItemToCartSchema = z.object({
  productId: uuid(),
  quantity: z.coerce.number(),
})
