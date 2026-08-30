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
  deleteCartItemController,
  getCartController,
  updateCartItemQuantityController,
} from './cartController.ts'

const router = Router()

router.use(authenticate)

/**
 * @openapi
 * /api/v1/items:
 *   post:
 *     summary: Add a product to the authenticated user's cart
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *                 format: uuid
 *                 example: cd36e8a5-530d-47f7-a7b6-ebb7d0a27945
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 example: 2
 *     responses:
 *       201:
 *         description: Product added to cart successfully
 *       400:
 *         description: Invalid request body or product ID
 *       401:
 *         description: Unauthenticated
 *       404:
 *         description: Product not found
 *       409:
 *         description: Requested quantity exceeds available stock
 */
router.post(
  '/',
  validateRequest('body', addItemToCartSchema),
  authorize('admin', 'user'),
  addItemToCartController,
)

/**
 * @openapi
 * /api/v1/items:
 *   get:
 *     summary: Get the authenticated user's cart items
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart items retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       cartId:
 *                         type: string
 *                         format: uuid
 *                       productId:
 *                         type: string
 *                         format: uuid
 *                       quantity:
 *                         type: integer
 *                         example: 2
 *       401:
 *         description: Unauthenticated
 *       404:
 *         description: Cart has no items
 */
router.get('/', authorize('admin', 'user'), getCartController)

/**
 * @openapi
 * /api/v1/items/{id}:
 *   patch:
 *     summary: Update a cart item quantity
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the cart item
 *         schema:
 *           type: string
 *           format: uuid
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 minimum: 0
 *                 example: 3
 *
 *     responses:
 *       200:
 *         description: Cart item updated successfully
 *
 *       400:
 *         description: Invalid cart item ID or quantity
 *
 *       401:
 *         description: Unauthenticated
 *
 *       403:
 *         description: User is not authorized to modify this cart item
 *
 *       404:
 *         description: Cart item not found
 *
 *       409:
 *         description: Requested quantity exceeds available product stock
 */
router.patch(
  '/:id',
  validateRequest('params', uuidSchema),
  validateRequest('body', quantitySchema),
  authorize('admin', 'user'),
  updateCartItemQuantityController,
)

/**
 * @openapi
 * /api/v1/items/{id}:
 *   delete:
 *     summary: Remove an item from the authenticated user's cart
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the cart item to remove
 *         schema:
 *           type: string
 *           format: uuid
 *
 *     responses:
 *       204:
 *         description: Cart item deleted successfully
 *
 *       400:
 *         description: Invalid cart item ID
 *
 *       401:
 *         description: Unauthenticated
 *
 *       403:
 *         description: User is not authorized to delete this cart item
 *
 *       404:
 *         description: Cart item not found
 */
router.delete(
  '/:id',
  validateRequest('params', uuidSchema),
  authorize('admin', 'user'),
  deleteCartItemController,
)

export default router
