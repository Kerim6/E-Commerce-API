import type { Response } from 'express'
import type { AuthenticatedRequest } from '../../middleware/auth.ts'
import {
  checkoutService,
  getOrderService,
  getOrdersService,
} from './orderService.ts'
import { UnauthorizedError } from '../../errors/UnauthorizedError.ts'

export const checkoutController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const userId = req.user?.id

  if (!userId) {
    throw new UnauthorizedError('Unauthenticated')
  }

  const checkedOut = await checkoutService(userId)

  return res.status(201).json(checkedOut)
}

export const getOrdersController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const userId = req.user?.id

  if (!userId) {
    throw new UnauthorizedError('Unauthenticated')
  }

  const orders = await getOrdersService(userId)

  return res.status(200).json(orders)
}

export const getOrderController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const userId = req.user?.id
  const orderId = req.params.id

  if (!userId) {
    throw new UnauthorizedError('Unauthenticated')
  }

  const order = await getOrderService(orderId, userId)

  return res.status(200).json(order)
}
