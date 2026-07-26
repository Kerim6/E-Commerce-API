import { authenticate, authorize } from '../../middleware/auth.ts'
import { Router } from 'express'
import { checkoutController } from './orderController.ts'

const router = Router()

router.use(authenticate)

router.post('/', authorize('admin', 'user'), checkoutController)

export default router
