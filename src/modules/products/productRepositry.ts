import type { ProductInput } from './productTypes.ts'
import { products } from '../../db/schema/products.ts'
import { db } from '../../db/connection.ts'
import { eq } from 'drizzle-orm'

export const createProduct = async (product: ProductInput) => {
  const [createdProduct] = await db.insert(products).values(product).returning()
  return createdProduct
}

export const findProducts = async () => {
  return await db.select().from(products)
}

export const findProduct = async (id: string) => {
  return await db.query.products.findFirst({
    where: eq(products.id, id),
  })
}

export const updateProduct = async (product: ProductInput, id: string) => {
  const [updatedProduct] = await db
    .update(products)
    .set(product)
    .where(eq(products.id, id))
    .returning()
  return updatedProduct
}

export const deleteProduct = async (id: string) => {
  const [deletedProduct] = await db
    .delete(products)
    .where(eq(products.id, id))
    .returning()
  return deletedProduct
}
