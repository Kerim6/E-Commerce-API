import { Router } from 'express'
import { authenticate, authorize } from '../../middleware/auth.ts'
import { validateRequest } from '../../middleware/validation.ts'
import { addItemToCartSchema } from './cartValidators.ts'
import { addItemToCartController, getCartController } from './cartController.ts'

const router = Router()

router.use(authenticate)

router.post(
  '/',
  validateRequest('body', addItemToCartSchema),
  authorize('admin', 'user'),
  addItemToCartController,
)

router.get('/', authorize('admin', 'user'), getCartController)

export default router
