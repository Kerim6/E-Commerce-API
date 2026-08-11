import type { Response } from 'express'
import type { AuthenticatedRequest } from '../../middleware/auth.ts'
import {
  addItemToCart,
  deleteCartItemService,
  getCartService,
  updateCartItemQuantityService,
} from './cartService.ts'
import { UnauthorizedError } from '../../errors/UnauthorizedError.ts'

export const addItemToCartController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const userId = req.user?.id
  const input = req.body

  if (!userId) {
    throw new UnauthorizedError('Unauthenticated')
  }
  const addedItem = await addItemToCart(input, userId)

  return res.status(201).json(addedItem)
}

export const getCartController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const userId = req.user?.id
  if (!userId) {
    throw new UnauthorizedError('Unauthenticated')
  }
  const getCart = await getCartService(userId)

  return res.status(200).json(getCart)
}

export const updateCartItemQuantityController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const paramId = req.params.id
  const { quantity } = req.body
  const userId = req.user?.id

  if (!userId) {
    throw new UnauthorizedError('Unauthenticated')
  }

  const updatedQuantity = await updateCartItemQuantityService(
    paramId,
    quantity,
    userId,
  )

  return res.status(200).json(updatedQuantity)
}

export const deleteCartItemController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const paramId = req.params.id
  const userId = req.user?.id

  if (!userId) {
    throw new UnauthorizedError('Unauthenticated')
  }

  const deletedItem = await deleteCartItemService(paramId, userId)

  return res.status(204).json(deletedItem)
}
