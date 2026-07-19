import { products } from '../../db/schema/products.ts'
import { createInsertSchema } from 'drizzle-zod'

export const productCreateSchema = createInsertSchema(products)
