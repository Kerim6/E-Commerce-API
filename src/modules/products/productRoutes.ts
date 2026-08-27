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

/**
 * @openapi
 * /api/v1/products:
 *   get:
 *     summary: Get all products
 *     tags:
 *       - Products
 *     responses:
 *       200:
 *         description: Successfully retrieved products
 */
router.get('/', findProductsController)

/**
 * @openapi
 * /api/v1/products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Product found
 *       400:
 *         description: Invalid product ID
 *       404:
 *         description: Product not found
 */
router.get(
  '/:id',
  validateRequest('params', uuidSchema),
  findProductByIdController,
)

router.use(authenticate)

/**
 * @openapi
 * /api/v1/products:
 *   post:
 *     summary: Create a product
 *     tags:
 *       - Products
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - slug
 *               - description
 *               - price
 *               - stock
 *               - categoryId
 *             properties:
 *               name:
 *                 type: string
 *               slug:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Unauthenticated
 *       403:
 *         description: Forbidden
 *       409:
 *         description: Product already exists
 */
router.post(
  '/',
  authorize('admin'),
  validateRequest('body', productCreateSchema),
  createProductController,
)

/**
 * @openapi
 * /api/v1/products/{id}:
 *   patch:
 *     summary: Update a product
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
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
 *                 example: Updated Gaming Laptop
 *               slug:
 *                 type: string
 *                 example: updated-gaming-laptop
 *               description:
 *                 type: string
 *                 example: Updated product description
 *               price:
 *                 type: number
 *                 example: 1499.99
 *               stock:
 *                 type: integer
 *                 example: 20
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Invalid product ID or request body
 *       401:
 *         description: Unauthenticated
 *       403:
 *         description: User is not authorized
 *       404:
 *         description: Product not found
 *       409:
 *         description: Product with the same name or slug already exists
 */
router.patch(
  '/:id',
  authorize('admin'),
  validateRequest('params', uuidSchema),
  validateRequest('body', productUpdateSchema),
  updateProductController,
)

/**
 * @openapi
 * /api/v1/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Product deleted successfully
 *       400:
 *         description: Invalid product ID
 *       401:
 *         description: Unauthenticated
 *       403:
 *         description: User is not authorized
 *       404:
 *         description: Product not found
 */
router.delete(
  '/:id',
  authorize('admin'),
  validateRequest('params', uuidSchema),
  deleteProductController,
)

export default router
