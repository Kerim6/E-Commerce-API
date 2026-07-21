import {
  createProductController,
  findProductsController,
  findProductByIdController,
  updateProductController,
  deleteProductController,
} from './productControllers.ts'
import { authenticate, authorize } from '../../middleware/auth.ts'
import { validateRequest } from '../../middleware/validation.ts'
import { Router } from 'express'
import {
  productCreateSchema,
  productUpdateSchema,
} from './productValidators.ts'
import { z } from 'zod'

const router = Router()

const uuidSchema = z.object({
  id: z.uuid(),
})

router.get('/', findProductsController)

router.get(
  '/:id',
  validateRequest('params', uuidSchema),
  findProductByIdController,
)

router.use(authenticate)

router.post(
  '/',
  authorize('admin'),
  validateRequest('body', productCreateSchema),
  createProductController,
)
router.patch(
  '/:id',
  authorize('admin'),
  validateRequest('params', uuidSchema),
  validateRequest('body', productUpdateSchema),
  updateProductController,
)

router.delete(
  '/:id',
  authorize('admin'),
  validateRequest('params', uuidSchema),
  deleteProductController,
)

export default router
