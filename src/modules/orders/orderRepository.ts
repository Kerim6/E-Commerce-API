import { db } from '../../db/connection.ts'
import { orderItems } from '../../db/schema/orderItems.ts'
import { orders } from '../../db/schema/orders.ts'
import { eq, and } from 'drizzle-orm'
import type { OrderStatusInput } from './orderTypes.ts'

type DatabaseLike =
  | typeof db
  | Parameters<Parameters<typeof db.transaction>[0]>[0]

export const createOrder = async (
  userId: string,
  totalPrice: number,
  database: DatabaseLike = db,
) => {
  const [createdOrder] = await database
    .insert(orders)
    .values({ userId: userId, totalPrice: totalPrice })
    .returning()
  return createdOrder
}

export const createOrderItem = async (
  orderId: string,
  productId: string,
  productName: string,
  unitPrice: number,
  quantity: number,
  database: DatabaseLike = db,
) => {
  const [createdItem] = await database
    .insert(orderItems)
    .values({
      orderId,
      productId,
      productName,
      unitPrice,
      quantity,
    })
    .returning()

  return createdItem
}

export const getOrders = async (userId: string) => {
  return await db.query.orders.findMany({
    where: eq(orders.userId, userId),
    with: {
      items: {
        with: {
          product: true,
        },
      },
      address: true,
    },
  })
}

export const getOrder = async (
  orderId: string,
  userId: string,
  database: DatabaseLike = db,
) => {
  return await database.query.orders.findFirst({
    where: and(eq(orders.id, orderId), eq(orders.userId, userId)),
    with: {
      items: {
        with: {
          product: true,
        },
      },
      address: true,
    },
  })
}

export const updateOrderStatus = async (
  orderId: string,
  status: OrderStatusInput,
  database: DatabaseLike = db,
) => {
  const [updatedStatus] = await database
    .update(orders)
    .set({ status: status })
    .where(eq(orders.id, orderId))
    .returning()

  return updatedStatus
}

export const findOrderByIdWithItems = async (
  orderId: string,
  database: DatabaseLike = db,
) => {
  return await database.query.orders.findFirst({
    where: eq(orders.id, orderId),
    with: {
      items: {
        with: {
          product: true,
        },
      },
      address: true,
    },
  })
}
