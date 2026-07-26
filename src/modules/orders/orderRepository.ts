import { db } from '../../db/connection.ts'
import { orderItems } from '../../db/schema/orderItems.ts'
import { orders } from '../../db/schema/orders.ts'

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
