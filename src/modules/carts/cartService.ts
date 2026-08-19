import { BadRequestError } from '../../errors/BadRequestError.ts'
import { ConflictError } from '../../errors/ConflictError .ts'
import { ForbiddenError } from '../../errors/ForbiddenError.ts'
import { NotFoundError } from '../../errors/NotFoundError.ts'
import { findProductById } from '../products/productRepository.ts'
import {
  createCart,
  createCartItem,
  deleteCartItem,
  findCartByUserId,
  findCartItem,
  findCartItemById,
  findCartWithItems,
  updateCartItemQuantity,
} from './cartRepository.ts'
import type { AddToCartInput, UpdateCartInput } from './cartTypes.ts'

export const addItemToCart = async (input: AddToCartInput, userId: string) => {
  if (input.quantity <= 0) {
    throw new BadRequestError('Quantity should not be negative or zero')
  }
  const product = await findProductById(input.productId)

  if (!product) {
    throw new NotFoundError('Product not found')
  }

  let cart = await findCartByUserId(userId)

  if (!cart) {
    cart = await createCart({ userId })
  }

  const existingItem = await findCartItem(cart.id, input.productId)

  if (existingItem) {
    const newQuantity = existingItem.quantity + input.quantity
    if (newQuantity > product.stock) {
      throw new ConflictError('The required quantity is not available')
    }
    return updateCartItemQuantity(existingItem.id, newQuantity)
  }
  if (input.quantity > product.stock) {
    throw new ConflictError('The required quantity is not available')
  }
  return createCartItem({
    cartId: cart.id,
    productId: input.productId,
    quantity: input.quantity,
  })
}

export const getCartService = async (userId: string) => {
  const getCart = await findCartWithItems(userId)

  return getCart
}

export const updateCartItemQuantityService = async (
  // input: UpdateCartInput,
  itemId: string,
  quantity: number,
  userId: string,
) => {
  const item = await findCartItemById(itemId)

  if (!item) {
    throw new NotFoundError('Cart item not found')
  }

  const cart = await findCartByUserId(userId)

  if (!cart || item.cartId !== cart.id) {
    throw new ForbiddenError('You are not allowed to access')
  }

  if (quantity < 0) {
    throw new BadRequestError('Quantity should not be negative')
  }

  if (quantity === 0) {
    return deleteCartItemService(item.id, userId)
  }

  if (quantity > item.product.stock) {
    throw new ConflictError('The required quantity is not available')
  }

  return updateCartItemQuantity(item.id, quantity)
}

export const deleteCartItemService = async (itemId: string, userId: string) => {
  const item = await findCartItemById(itemId)

  if (!item) {
    throw new NotFoundError('Item not found')
  }

  const cart = await findCartByUserId(userId)

  if (!cart || item.cartId !== cart.id) {
    throw new ForbiddenError('You are not allowed to access')
  }

  return deleteCartItem(item.id)
}
