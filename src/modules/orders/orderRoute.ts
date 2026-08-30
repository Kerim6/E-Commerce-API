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

/**
 * @openapi
 * /api/v1/orders:
 *   post:
 *     summary: Checkout the authenticated user's cart
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                 userId:
 *                   type: string
 *                   format: uuid
 *                 status:
 *                   type: string
 *                   example: pending
 *                 totalPrice:
 *                   type: number
 *                   example: 249.97
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       productId:
 *                         type: string
 *                         format: uuid
 *                       quantity:
 *                         type: integer
 *                         example: 2
 *                       unitPrice:
 *                         type: number
 *                         example: 49.99
 *
 *       401:
 *         description: Unauthenticated
 *
 *       404:
 *         description: Cart not found
 *
 *       409:
 *         description: Cart is empty or requested quantity exceeds available product stock
 */
router.post('/', authorize('admin', 'user'), checkoutController)

/**
 * @openapi
 * /api/v1/orders:
 *   get:
 *     summary: Get all orders for the authenticated user
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                   userId:
 *                     type: string
 *                     format: uuid
 *                   status:
 *                     type: string
 *                     example: pending
 *                   totalPrice:
 *                     type: number
 *                     example: 249.97
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   items:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         productId:
 *                           type: string
 *                           format: uuid
 *                         quantity:
 *                           type: integer
 *                           example: 2
 *                         unitPrice:
 *                           type: number
 *                           example: 49.99
 *
 *       401:
 *         description: Unauthenticated
 *
 *       404:
 *         description: No orders found for the authenticated user
 */
router.get('/', authorize('admin', 'user'), getOrdersController)

/**
 * @openapi
 * /api/v1/orders/{id}:
 *   get:
 *     summary: Get an order by ID
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the order
 *         schema:
 *           type: string
 *           format: uuid
 *
 *     responses:
 *       200:
 *         description: Order retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                 userId:
 *                   type: string
 *                 status:
 *                   type: string
 *                   example: pending
 *                 totalPrice:
 *                   type: number
 *                   example: 249.97
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       productId:
 *                         type: string
 *                         format: uuid
 *                       quantity:
 *                         type: integer
 *                         example: 2
 *                       unitPrice:
 *                         type: number
 *                         example: 49.99
 *
 *       400:
 *         description: Invalid order ID
 *
 *       401:
 *         description: Unauthenticated
 *
 *       404:
 *         description: Order not found
 */
router.get(
  '/:id',
  validateRequest('params', uuidSchema),
  authorize('admin', 'user'),
  getOrderController,
)

/**
 * @openapi
 * /api/v1/orders/{id}/cancel:
 *   patch:
 *     summary: Cancel an order
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the order to cancel
 *         schema:
 *           type: string
 *           format: uuid
 *
 *     responses:
 *       200:
 *         description: Order cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                 userId:
 *                   type: string
 *                   format: uuid
 *                 status:
 *                   type: string
 *                   example: cancelled
 *                 totalPrice:
 *                   type: number
 *                   example: 249.97
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *
 *       400:
 *         description: Invalid order ID
 *
 *       401:
 *         description: Unauthenticated
 *
 *       403:
 *         description: Order cannot be cancelled in its current status
 *
 *       404:
 *         description: Order not found
 */
router.patch(
  '/:id/cancel',
  validateRequest('params', uuidSchema),
  authorize('admin', 'user'),
  cancelOrderController,
)

/**
 * @openapi
 * /api/v1/orders/{id}/status:
 *   patch:
 *     summary: Update an order status
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the order
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
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum:
 *                   - pending
 *                   - processing
 *                   - shipped
 *                   - delivered
 *                   - cancelled
 *                 example: processing
 *
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                 userId:
 *                   type: string
 *                   format: uuid
 *                 status:
 *                   type: string
 *                   example: processing
 *                 totalPrice:
 *                   type: number
 *                   example: 249.97
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *
 *       400:
 *         description: Invalid order ID or invalid status
 *
 *       401:
 *         description: Unauthenticated
 *
 *       403:
 *         description: User is not authorized to update order status
 *
 *       404:
 *         description: Order not found
 */
router.patch(
  '/:id/status',
  validateRequest('params', uuidSchema),
  validateRequest('body', orderStatusSchema),
  authorize('admin'),
  updateOrderStatusController,
)

export default router
