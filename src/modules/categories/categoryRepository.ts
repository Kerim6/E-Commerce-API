import { db } from '../../db/connection.ts'
import { categories } from '../../db/schema/categories.ts'
import type { categoryInput } from './categoriesTypes.ts'
import { eq, sql } from 'drizzle-orm'

export const createCategory = async (category: categoryInput) => {
  const [createdCategory] = await db
    .insert(categories)
    .values(category)
    .returning()
  return createdCategory
}

export const findAllCategories = async () => {
  return await db.select().from(categories)
}

export const findCategoryById = async (id: string) => {
  return await db.query.categories.findFirst({ where: eq(categories.id, id) })
}

export const findCategoryByName = async (name: string) => {
  return await db.query.categories.findFirst({
    where: eq(categories.name, name),
  })
}

export const findCategoryBySlug = async (slug: string) => {
  return await db.query.categories.findFirst({
    where: eq(categories.slug, slug),
  })
}

export const updateCategory = async (category: categoryInput, id: string) => {
  const [updatedCategory] = await db
    .update(categories)
    .set({ name: category.name, slug: category.slug, updatedAt: sql`NOW()` })
    .where(eq(categories.id, id))
    .returning()

  return updatedCategory
}

export const deleteCategory = async (id: string) => {
  const [deletedCategory] = await db
    .delete(categories)
    .where(eq(categories.id, id))
    .returning()
  return deletedCategory
}
