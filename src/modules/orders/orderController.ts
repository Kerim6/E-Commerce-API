import type { Response } from 'express'
import type { AuthenticatedRequest } from '../../middleware/auth.ts'
import {
  cancelOrderService,
  checkoutService,
  getOrderService,
  getOrdersService,
  updateOrderStatusService,
} from './orderService.ts'
import { UnauthorizedError } from '../../errors/UnauthorizedError.ts'
import { stat } from 'fs'

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

export const cancelOrderController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const userId = req.user?.id
  const userRole = req.user?.role
  const orderId = req.params.id

  if (!userId || !userRole) {
    throw new UnauthorizedError('Please login in first')
  }

  const cancelOrder = await cancelOrderService(orderId, userId, userRole)

  return res.status(200).json(cancelOrder)
}

export const updateOrderStatusController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const orderId = req.params.id
  const { status } = req.body
  const updatedStatus = await updateOrderStatusService(orderId, status)

  return res.status(200).json(updatedStatus)
}
