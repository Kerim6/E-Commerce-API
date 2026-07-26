import { authenticate, authorize } from '../../middleware/auth.ts'
import { Router } from 'express'
import {
  checkoutController,
  getOrderController,
  getOrdersController,
} from './orderController.ts'
import { validateRequest } from '../../middleware/validation.ts'
import { uuidSchema } from './orderValidator.ts'

const router = Router()

router.use(authenticate)

router.post('/', authorize('admin', 'user'), checkoutController)

router.get('/', authorize('admin', 'user'), getOrdersController)

router.get(
  '/:id',
  validateRequest('params', uuidSchema),
  authorize('admin', 'user'),
  getOrderController,
)

export default router
