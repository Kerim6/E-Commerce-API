import { authenticate, authorize } from '../../middleware/auth.ts'
import { Router } from 'express'
import {
  cancelOrderController,
  checkoutController,
  getOrderController,
  getOrdersController,
  updateOrderStatusController,
} from './orderController.ts'
import { validateRequest } from '../../middleware/validation.ts'
import { uuidSchema, orderStatusSchema } from './orderValidator.ts'

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

router.patch(
  '/:id/cancel',
  validateRequest('params', uuidSchema),
  authorize('admin', 'user'),
  cancelOrderController,
)

router.patch(
  '/:id/status',
  validateRequest('params', uuidSchema),
  validateRequest('body', orderStatusSchema),
  authorize('admin'),
  updateOrderStatusController,
)

export default router
