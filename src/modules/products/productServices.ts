import { ConflictError } from '../../errors/ConflictError .ts'
import { NotFoundError } from '../../errors/NotFoundError.ts'
import { findCategoryById } from '../categories/categoryRepository.ts'
import {
  createProduct,
  deleteProduct,
  findProductById,
  findProductByName,
  findProductBySlug,
  findProducts,
  updateProduct,
} from './productRepository.ts'
import type { ProductInput } from './productTypes.ts'

export const createProductService = async (product: ProductInput) => {
  const [category, existingByName, existingBySlug] = await Promise.all([
    findCategoryById(product.categoryId),
    findProductByName(product.name),
    findProductBySlug(product.slug),
  ])

  if (!category) {
    throw new NotFoundError('Category not found')
  }

  if (existingByName) {
    throw new ConflictError('Product name already exists')
  }

  if (existingBySlug) {
    throw new ConflictError('Product slug already exists')
  }

  return createProduct(product)
}

export const findProductsService = async () => {
  return findProducts()
}

export const findProductByIdService = async (id: string) => {
  const existingProduct = await findProductById(id)
  if (!existingProduct) {
    throw new NotFoundError('Product not found')
  }

  return existingProduct
}

export const updateProductService = async (
  product: ProductInput,
  id: string,
) => {
  const [existingProduct, existingCategory, existingByName, existingBySlug] =
    await Promise.all([
      findProductById(id),
      findCategoryById(product.categoryId),
      findProductByName(product.name),
      findProductBySlug(product.slug),
    ])

  if (!existingProduct) {
    throw new NotFoundError('Product not found')
  }

  if (!existingCategory) {
    throw new NotFoundError('Category not found')
  }

  if (existingByName && existingByName.id !== id) {
    throw new ConflictError('Product name already exists')
  }

  if (existingBySlug && existingBySlug.id !== id) {
    throw new ConflictError('Product slug already exists')
  }

  return updateProduct(product, id)
}

export const deleteProductService = async (id: string) => {
  const existingProduct = await findProductById(id)
  if (!existingProduct) {
    throw new NotFoundError('Product not found')
  }

  return deleteProduct(id)
}
