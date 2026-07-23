import { Router } from 'express'
import { authenticate, authorize } from '../../middleware/auth.ts'
import { validateRequest } from '../../middleware/validation.ts'
import {
  addItemToCartSchema,
  uuidSchema,
  quantitySchema,
} from './cartValidators.ts'
import {
  addItemToCartController,
  deleteCartItemController,
  getCartController,
  updateCartItemQuantityController,
} from './cartController.ts'

const router = Router()

router.use(authenticate)

router.post(
  '/',
  validateRequest('body', addItemToCartSchema),
  authorize('admin', 'user'),
  addItemToCartController,
)

router.get('/', authorize('admin', 'user'), getCartController)

router.patch(
  '/:id',
  validateRequest('params', uuidSchema),
  validateRequest('body', quantitySchema),
  authorize('admin', 'user'),
  updateCartItemQuantityController,
)

router.delete(
  '/:id',
  validateRequest('params', uuidSchema),
  authorize('admin', 'user'),
  deleteCartItemController,
)

export default router
