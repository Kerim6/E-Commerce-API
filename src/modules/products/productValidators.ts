import { createInsertSchema } from 'drizzle-zod'
import { products } from '../../db/schema/products.ts'

export const productCreateSchema = createInsertSchema(products)
export const productUpdateSchema = productCreateSchema.partial()
