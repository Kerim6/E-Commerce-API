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

export default router
