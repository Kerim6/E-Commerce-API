import { db } from '../../db/connection.ts'
import type { NewCart, NewCartItem, UpdateCartItem } from './cartTypes.ts'
import { carts } from '../../db/schema/carts.ts'
import { eq, and } from 'drizzle-orm'
import { cartItems } from '../../db/schema/cartItems.ts'

export const createCart = async (cart: NewCart) => {
  const [createdCart] = await db.insert(carts).values(cart).returning()
  return createdCart
}

export const findCartByUserId = async (userId: string) => {
  return await db.query.carts.findFirst({
    where: eq(carts.userId, userId),
  })
}

export const findCartItem = async (cartId: string, productId: string) => {
  return await db.query.cartItems.findFirst({
    where: and(
      eq(cartItems.cartId, cartId),
      eq(cartItems.productId, productId),
    ),
  })
}

export const createCartItem = async (cartItem: NewCartItem) => {
  const [createdCartItem] = await db
    .insert(cartItems)
    .values(cartItem)
    .returning()
  return createdCartItem
}

export const updateCartItemQuantity = async (id: string, quantity: number) => {
  const [updatedCartItemQuantity] = await db
    .update(cartItems)
    .set({ quantity })
    .where(eq(cartItems.id, id))
    .returning()

  return updatedCartItemQuantity
}

export const findCartWithItems = async (userId: string) => {
  return await db.query.carts.findFirst({
    where: eq(carts.userId, userId),
    with: {
      items: {
        with: {
          product: true,
        },
      },
    },
  })
}

export const findCartItemById = async (id: string) => {
  return await db.query.cartItems.findFirst({
    where: eq(cartItems.id, id),
    with: {
      product: true,
    },
  })
}

export const deleteCartItem = async (id: string) => {
  const [deletedItem] = await db
    .delete(cartItems)
    .where(eq(cartItems.id, id))
    .returning()

  return deletedItem
}
