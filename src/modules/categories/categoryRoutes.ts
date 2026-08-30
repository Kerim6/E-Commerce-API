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

/**
 * @openapi
 * /api/v1/categories:
 *   get:
 *     summary: Get all categories
 *     tags:
 *       - Categories
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 */
router.get('/', findAllCategoriesController)

/**
 * @openapi
 * /api/v1/categories/{id}:
 *   get:
 *     summary: Get a category by ID
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Category ID
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Category retrieved successfully
 *       400:
 *         description: Invalid category ID
 *       404:
 *         description: Category not found
 */
router.get(
  '/:id',
  validateRequest('params', uuidSchema),
  findCategoryByIdController,
)

router.use(authenticate)

/**
 * @openapi
 * /api/v1/categories:
 *   post:
 *     summary: Create a new category
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - slug
 *             properties:
 *               name:
 *                 type: string
 *                 example: Electronics
 *               slug:
 *                 type: string
 *                 example: electronics
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Unauthenticated
 *       403:
 *         description: User is not authorized
 *       409:
 *         description: Category with the same name or slug already exists
 */
router.post(
  '/',
  validateRequest('body', categoryInsertSchema),
  authorize('admin'),
  createCategoryController,
)

/**
 * @openapi
 * /api/v1/categories/{id}:
 *   patch:
 *     summary: Update a category
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Category ID
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Electronics
 *               slug:
 *                 type: string
 *                 example: updated-electronics
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       400:
 *         description: Invalid category ID or request body
 *       401:
 *         description: Unauthenticated
 *       403:
 *         description: User is not authorized
 *       404:
 *         description: Category not found
 *       409:
 *         description: Category with the same name or slug already exists
 */
router.put(
  '/:id',
  validateRequest('params', uuidSchema),
  validateRequest('body', categoryInsertSchema),
  authorize('admin'),
  updateCategoryController,
)

/**
 * @openapi
 * /api/v1/categories/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Category ID
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Category deleted successfully
 *       400:
 *         description: Invalid category ID
 *       401:
 *         description: Unauthenticated
 *       403:
 *         description: User is not authorized
 *       404:
 *         description: Category not found
 */
router.delete(
  '/:id',
  validateRequest('params', uuidSchema),
  authorize('admin'),
  deleteCategoryController,
)

export default router
