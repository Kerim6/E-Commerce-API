import type { Response } from 'express'
import type { AuthenticatedRequest } from '../../middleware/auth.ts'
import { checkoutService } from './checkoutService.ts'
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
