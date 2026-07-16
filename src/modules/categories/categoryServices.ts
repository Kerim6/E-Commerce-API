import { ConflictError } from '../../errors/ConflictError .ts'
import type { categoryInput } from './categoriesTypes.ts'
import {
  createCategory,
  findCategoryBySlug,
  findCategoryByName,
  findAllCategories,
  findCategoryById,
  updateCategory,
  deleteCategory,
} from './categoryRepository.ts'
import { NotFoundError } from '../../errors/NotFoundError.ts'

export const createCategoryService = async (category: categoryInput) => {
  const existingCategoryBySlug = await findCategoryBySlug(category.slug)
  const existingCategoryByName = await findCategoryByName(category.name)

  if (existingCategoryBySlug || existingCategoryByName) {
    throw new ConflictError('The category is already in place.')
  }
  return createCategory(category)
}

export const findAllCategoriesService = async () => {
  return findAllCategories()
}

export const findCategoryByIdService = async (id: string) => {
  const existingCategory = await findCategoryById(id)

  if (!existingCategory) {
    throw new NotFoundError('Category not found')
  }
  return existingCategory
}

export const updateCategoryService = async (
  category: categoryInput,
  id: string,
) => {
  const existingCategory = await findCategoryById(id)

  if (!existingCategory) {
    throw new NotFoundError('Category not found')
  }

  const categoryWithSameSlug = await findCategoryBySlug(category.slug)

  if (categoryWithSameSlug && categoryWithSameSlug.id !== id) {
    throw new ConflictError('Category slug already exists')
  }

  const categoryWithSameName = await findCategoryByName(category.name)

  if (categoryWithSameName && categoryWithSameName.id !== id) {
    throw new ConflictError('Category name already exists')
  }

  return updateCategory(category, id)
}

export const deleteCategoryService = async (id: string) => {
  const existingCategory = await findCategoryById(id)

  if (!existingCategory) {
    throw new NotFoundError('Category not found')
  }

  return deleteCategory(id)
}
