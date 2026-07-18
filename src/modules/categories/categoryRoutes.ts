import { Router } from 'express'
import { authenticate, authorize } from '../../middleware/auth.ts'
import { validateRequest } from '../../middleware/validation.ts'
import {
  createCategoryController,
  deleteCategoryController,
  findAllCategoriesController,
  findCategoryByIdController,
  updateCategoryController,
} from './categoryControllers.ts'
import { categoryInsertSchema } from './categoriesValidators.ts'
import { z } from 'zod'

const router = Router()

const uuidSchema = z.object({
  id: z.uuid(),
})

router.use(authenticate)

router.post(
  '/',
  validateRequest('body', categoryInsertSchema),
  authorize('admin'),
  createCategoryController,
)

router.get('/', authorize('admin', 'user'), findAllCategoriesController)

router.get(
  '/:id',
  validateRequest('params', uuidSchema),
  authorize('admin', 'user'),
  findCategoryByIdController,
)

router.put(
  '/:id',
  validateRequest('params', uuidSchema),
  validateRequest('body', categoryInsertSchema),
  authorize('admin'),
  updateCategoryController,
)

router.delete(
  '/:id',
  validateRequest('params', uuidSchema),
  authorize('admin'),
  deleteCategoryController,
)

export default router
