import { products } from '../../db/schema/products.ts'

export type NewProduct = typeof products.$inferInsert
export type UpdateProduct = Partial<NewProduct>
