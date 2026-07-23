import type { cartItems } from '../../db/schema/cartItems.ts'
import { carts } from '../../db/schema/carts.ts'
import { z } from 'zod'

export type NewCart = typeof carts.$inferInsert
export type UpdateCart = Partial<NewCart>

export type NewCartItem = typeof cartItems.$inferInsert
export type UpdateCartItem = Partial<NewCartItem>

export type AddToCartInput = {
  productId: string
  quantity: number
}

export type UpdateCartInput = {
  itemId: string
  quantity: number
}
