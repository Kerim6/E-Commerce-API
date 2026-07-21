import { products } from '../../db/schema/products.ts'
import { db } from '../../db/connection.ts'
import { eq } from 'drizzle-orm'
import type { NewProduct, UpdateProduct } from './productTypes.ts'

export const createProduct = async (product: NewProduct) => {
  const [createdProduct] = await db.insert(products).values(product).returning()
  return createdProduct
}

export const findProducts = async () => {
  return await db.select().from(products)
}

export const findProductById = async (id: string) => {
  return await db.query.products.findFirst({
    where: eq(products.id, id),
  })
}

export const findProductByName = async (name: string) => {
  return await db.query.products.findFirst({
    where: eq(products.name, name),
  })
}

export const findProductBySlug = async (slug: string) => {
  return await db.query.products.findFirst({
    where: eq(products.slug, slug),
  })
}

export const updateProduct = async (product: UpdateProduct, id: string) => {
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
