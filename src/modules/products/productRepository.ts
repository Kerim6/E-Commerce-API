import { products } from '../../db/schema/products.ts'
import { db } from '../../db/connection.ts'
import { eq } from 'drizzle-orm'
import type { NewProduct, UpdateProduct } from './productTypes.ts'

type DatabaseLike =
  | typeof db
  | Parameters<Parameters<typeof db.transaction>[0]>[0]

export const createProduct = async (
  product: NewProduct,
  database: DatabaseLike = db,
) => {
  const [createdProduct] = await database
    .insert(products)
    .values(product)
    .returning()
  return createdProduct
}

export const findProducts = async (database: DatabaseLike = db) => {
  return await database.select().from(products)
}

export const findProductById = async (
  id: string,
  database: DatabaseLike = db,
) => {
  return await database.query.products.findFirst({
    where: eq(products.id, id),
  })
}

export const findProductByName = async (
  name: string,
  database: DatabaseLike = db,
) => {
  return await database.query.products.findFirst({
    where: eq(products.name, name),
  })
}

export const findProductBySlug = async (
  slug: string,
  database: DatabaseLike = db,
) => {
  return await database.query.products.findFirst({
    where: eq(products.slug, slug),
  })
}

export const updateProduct = async (
  product: UpdateProduct,
  id: string,
  database: DatabaseLike = db,
) => {
  const [updatedProduct] = await database
    .update(products)
    .set(product)
    .where(eq(products.id, id))
    .returning()
  return updatedProduct
}

export const updateProductStock = async (
  productId: string,
  remaining: number,
  database: DatabaseLike = db,
) => {
  const [updatedStock] = await database
    .update(products)
    .set({ stock: remaining })
    .where(eq(products.id, productId))
    .returning()

  return updatedStock
}

export const deleteProduct = async (
  id: string,
  database: DatabaseLike = db,
) => {
  const [deletedProduct] = await database
    .delete(products)
    .where(eq(products.id, id))
    .returning()
  return deletedProduct
}
