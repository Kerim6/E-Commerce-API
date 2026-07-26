import { db } from '../../db/connection.ts'
import { ConflictError } from '../../errors/ConflictError .ts'
import { NotFoundError } from '../../errors/NotFoundError.ts'
import { deleteCartItem, findCartWithItems } from '../carts/cartRepository.ts'
import { updateProductStock } from '../products/productRepository.ts'
import {
  createOrder,
  createOrderItem,
  getOrder,
  getOrders,
} from './orderRepository.ts'

export const checkoutService = async (userId: string) => {
  const checkoutTransaction = await db.transaction(async (tx) => {
    // Load the user's cart and its items.
    const cart = await findCartWithItems(userId)

    if (!cart) {
      throw new NotFoundError('Cart not found')
    }

    if (cart.items.length === 0) {
      throw new ConflictError('Cart is empty')
    }

    // Calculate the order total.
    let total = 0
    for (const item of cart.items) {
      total += parseFloat(item.product.price) * item.quantity
    }

    // Ensure the requested quantity is available for each product.
    for (const item of cart.items) {
      if (item.quantity > item.product.stock) {
        throw new ConflictError('Quantity is bigger than the available stock')
      }
    }

    // Create the order and its items inside the transaction.
    const order = await createOrder(userId, total, tx)

    for (const item of cart.items) {
      await createOrderItem(
        order.id,
        item.product.id,
        item.product.name,
        parseFloat(item.product.price),
        item.quantity,
        tx,
      )
    }

    // Update stock and clear the cart after a successful checkout.
    for (const item of cart.items) {
      const remainingStock = item.product.stock - item.quantity
      await updateProductStock(item.product.id, remainingStock, tx)
    }

    for (const item of cart.items) {
      await deleteCartItem(item.id, tx)
    }

    return order
  })

  return checkoutTransaction
}

export const getOrdersService = async (userId: string) => {
  const orders = await getOrders(userId)

  if (!orders || orders.length === 0) {
    throw new NotFoundError('No orders found')
  }

  return orders
}

export const getOrderService = async (orderId: string, userId: string) => {
  const order = await getOrder(orderId, userId)

  if (!order) {
    throw new NotFoundError('Order not found')
  }

  return order
}
