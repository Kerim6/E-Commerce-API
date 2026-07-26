import { authenticate, authorize } from '../../middleware/auth.ts'
import { Router } from 'express'
import { checkoutController, getOrdersController } from './orderController.ts'

const router = Router()

router.use(authenticate)

router.post('/', authorize('admin', 'user'), checkoutController)

router.get('/', authorize('admin', 'user'), getOrdersController)

export default router
