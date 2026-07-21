import type { NewProduct, UpdateProduct } from './productTypes.ts'
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

export const createProductService = async (product: NewProduct) => {
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
  product: UpdateProduct,
  id: string,
) => {
  const existingProduct = await findProductById(id)

  if (!existingProduct) {
    throw new NotFoundError('Product not found')
  }

  if (product.categoryId) {
    const category = await findCategoryById(product.categoryId)

    if (!category) {
      throw new NotFoundError('Category not found')
    }
  }

  if (product.name) {
    const existingByName = await findProductByName(product.name)

    if (existingByName && existingByName.id !== id) {
      throw new ConflictError('Product name already exists')
    }
  }

  if (product.slug) {
    const existingBySlug = await findProductBySlug(product.slug)

    if (existingBySlug && existingBySlug.id !== id) {
      throw new ConflictError('Product slug already exists')
    }
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
