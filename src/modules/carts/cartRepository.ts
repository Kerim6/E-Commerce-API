import { db } from '../../db/connection.ts'
import type { NewCart, NewCartItem, UpdateCartItem } from './cartTypes.ts'
import { carts } from '../../db/schema/carts.ts'
import { eq, and } from 'drizzle-orm'
import { cartItems } from '../../db/schema/cartItems.ts'

type DatabaseLike =
  | typeof db
  | Parameters<Parameters<typeof db.transaction>[0]>[0]

export const createCart = async (
  cart: NewCart,
  database: DatabaseLike = db,
) => {
  const [createdCart] = await database.insert(carts).values(cart).returning()
  return createdCart
}

export const findCartByUserId = async (
  userId: string,
  database: DatabaseLike = db,
) => {
  return await database.query.carts.findFirst({
    where: eq(carts.userId, userId),
  })
}

export const findCartItem = async (
  cartId: string,
  productId: string,
  database: DatabaseLike = db,
) => {
  return await database.query.cartItems.findFirst({
    where: and(
      eq(cartItems.cartId, cartId),
      eq(cartItems.productId, productId),
    ),
  })
}

export const createCartItem = async (
  cartItem: NewCartItem,
  database: DatabaseLike = db,
) => {
  const [createdCartItem] = await database
    .insert(cartItems)
    .values(cartItem)
    .returning()
  return createdCartItem
}

export const updateCartItemQuantity = async (
  id: string,
  quantity: number,
  database: DatabaseLike = db,
) => {
  const [updatedCartItemQuantity] = await database
    .update(cartItems)
    .set({ quantity: quantity })
    .where(eq(cartItems.id, id))
    .returning()

  return updatedCartItemQuantity
}

export const findCartWithItems = async (
  userId: string,
  database: DatabaseLike = db,
) => {
  return await database.query.carts.findFirst({
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

export const findCartItemById = async (
  id: string,
  database: DatabaseLike = db,
) => {
  return await database.query.cartItems.findFirst({
    where: eq(cartItems.id, id),
    with: {
      product: true,
    },
  })
}

export const deleteCartItem = async (
  id: string,
  database: DatabaseLike = db,
) => {
  const [deletedItem] = await database
    .delete(cartItems)
    .where(eq(cartItems.id, id))
    .returning()

  return deletedItem
}
