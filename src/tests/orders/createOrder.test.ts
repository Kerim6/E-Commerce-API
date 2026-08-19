import { createTestUser } from '../helpers/authHelpers.ts'
import { createTestOrder } from '../helpers/orderHelper.ts'
import request from 'supertest'
import app from '../../server.ts'
import { createTestCartItem } from '../factories/cartFactory.ts'
import { vi } from 'vitest'
import * as cartRepository from '../../modules/carts/cartRepository.ts'
import * as orderRepository from '../../modules/orders/orderRepository.ts'

describe('POST /api/v1/orders', () => {
  it('should allow user to checkout an order', async () => {
    const user = await createTestUser()
    const order = await createTestOrder(user.token)

    expect(order.response.status).toBe(201)
  })

  it('should reject an unauthenticated user', async () => {
    const response = await request(app).post('/api/v1/orders')

    expect(response.status).toBe(401)
  })

  it('should throw 404 when no cart is found for the given userId', async () => {
    const user = await createTestUser()

    const response = await request(app)
      .post('/api/v1/orders')
      .set('Authorization', `Bearer ${user.token}`)

    expect(response.status).toBe(404)
    expect(response.body.message).toBe('Cart not found')
  })

  it('should return 409 when the user cart contains no items', async () => {
    const user = await createTestUser()
    await createTestOrder(user.token)

    const response = await request(app)
      .post('/api/v1/orders')
      .set('Authorization', `Bearer ${user.token}`)

    expect(response.status).toBe(409)
    expect(response.body.message).toBe('Cart is empty')
  })

  it('should return 409 when item quantity exceeds available product stock', async () => {
    const user = await createTestUser()
    const cartItem = await createTestCartItem(user.token, {
      stock: 10,
      quantity: 6,
    })

    const admin = await createTestUser({ role: 'admin' })
    await request(app)
      .patch(`/api/v1/products/${cartItem.product.product.id}`)
      .set('Authorization', `Bearer ${admin.token}`)
      .send({ stock: 5 })

    const response = await request(app)
      .post('/api/v1/orders')
      .set('Authorization', `Bearer ${user.token}`)

    expect(response.status).toBe(409)
    expect(response.body.message).toBe(
      'Quantity is bigger than the available stock',
    )
  })

  it('should allow checkout when item quantity is exactly equal to available product stock', async () => {
    const user = await createTestUser()
    await createTestCartItem(user.token, { stock: 5, quantity: 5 })

    const response = await request(app)
      .post('/api/v1/orders')
      .set('Authorization', `Bearer ${user.token}`)

    expect(response.status).toBe(201)
  })

  it('should accurately calculate total price by summing parsed product prices multiplied by quantities', async () => {
    const user = await createTestUser()
    const cartItem1 = await createTestCartItem(user.token, {
      stock: 13,
      quantity: 9,
    })
    const cartItem2 = await createTestCartItem(user.token, {
      stock: 8,
      quantity: 7,
    })

    const response = await request(app)
      .post('/api/v1/orders')
      .set('Authorization', `Bearer ${user.token}`)

    const price1 = parseFloat(cartItem1.product.product.price)
    const price2 = parseFloat(cartItem2.product.product.price)
    const expectedTotal =
      price1 * cartItem1.response.body.quantity +
      price2 * cartItem2.response.body.quantity

    expect(response.status).toBe(201)
    expect(response.body.totalPrice).toBe(expectedTotal)
  })

  it('should create an order with the correct userId and calculated total within the transaction', async () => {
    const user = await createTestUser()
    const cartItem1 = await createTestCartItem(user.token, {
      stock: 10,
      quantity: 2,
    })
    const cartItem2 = await createTestCartItem(user.token, {
      stock: 15,
      quantity: 3,
    })

    const response = await request(app)
      .post('/api/v1/orders')
      .set('Authorization', `Bearer ${user.token}`)

    const price1 = parseFloat(cartItem1.product.product.price)
    const price2 = parseFloat(cartItem2.product.product.price)
    const expectedTotal =
      price1 * cartItem1.response.body.quantity +
      price2 * cartItem2.response.body.quantity

    expect(response.status).toBe(201)
    expect(response.body.userId).toBe(user.user.id)
    expect(response.body.totalPrice).toBe(expectedTotal)
  })

  it('should create order items with product snapshot details inside the transaction', async () => {
    const user = await createTestUser()
    const cartItem = await createTestCartItem(user.token)

    const response = await request(app)
      .post('/api/v1/orders')
      .set('Authorization', `Bearer ${user.token}`)

    expect(response.status).toBe(201)
    expect(response.body.items[0].productId).toBe(cartItem.product.product.id)
  })

  it('should deduct requested quantity from product stock for each cart item', async () => {
    const user = await createTestUser()
    const cartItem = await createTestCartItem(user.token, {
      stock: 14,
      quantity: 5,
    })

    const response = await request(app)
      .post('/api/v1/orders')
      .set('Authorization', `Bearer ${user.token}`)

    expect(response.status).toBe(201)
    expect(response.body.items[0].product.stock).toBe(
      cartItem.product.product.stock - cartItem.response.body.quantity,
    )
  })

  it('should delete all items from the cart inside the transaction upon successful order creation', async () => {
    const user = await createTestUser()
    await createTestCartItem(user.token)

    const response = await request(app)
      .post('/api/v1/orders')
      .set('Authorization', `Bearer ${user.token}`)

    const getCartResponse = await request(app)
      .get('/api/v1/items')
      .set('Authorization', `Bearer ${user.token}`)

    expect(response.status).toBe(201)
    expect(getCartResponse.status).toBe(200)
    expect(getCartResponse.body.items).toStrictEqual([])
  })

  it('should return the created order object on successful transaction completion', async () => {
    const user = await createTestUser()
    const order = await createTestOrder(user.token)

    expect(order.response.status).toBe(201)
    expect(order.response.body).toHaveProperty('id')
    expect(order.response.body).toHaveProperty('userId')
    expect(order.response.body.status).toBe('pending')
    expect(order.response.body).toHaveProperty('totalPrice')
    expect(order.response.body).toHaveProperty('createdAt')
    expect(order.response.body.items).toBeInstanceOf(Array)
  })

  it('should roll back order creation and stock updates if deleting a cart item fails', async () => {
    const user = await createTestUser()
    const cartItem = await createTestCartItem(user.token, {
      stock: 10,
      quantity: 2,
    })

    const spy = vi
      .spyOn(cartRepository, 'deleteCartItem')
      .mockImplementation(async () => {
        throw new Error('Simulated delete failure')
      })

    const response = await request(app)
      .post('/api/v1/orders')
      .set('Authorization', `Bearer ${user.token}`)

    // The server should respond with an internal error due to the simulated failure
    expect(response.status).toBe(500)

    // Product stock must remain unchanged because transaction should rollback
    const productRes = await request(app).get(
      `/api/v1/products/${cartItem.product.product.id}`,
    )
    expect(productRes.status).toBe(200)
    expect(productRes.body.stock).toBe(cartItem.product.product.stock)

    // Cart should still contain the item since deleting the cart item failed
    const getCartResponse = await request(app)
      .get('/api/v1/items')
      .set('Authorization', `Bearer ${user.token}`)

    expect(getCartResponse.status).toBe(200)
    expect(getCartResponse.body.items).toHaveLength(1)
    expect(getCartResponse.body.items[0].id).toBe(cartItem.response.body.id)

    // No orders should have been created for the user
    const ordersResp = await request(app)
      .get('/api/v1/orders')
      .set('Authorization', `Bearer ${user.token}`)
    expect(ordersResp.status).toBe(404)

    spy.mockRestore()
  })

  it('should roll back all database changes if creating an order item throws an error', async () => {
    const user = await createTestUser()
    const cartItem = await createTestCartItem(user.token, {
      stock: 12,
      quantity: 3,
    })

    const spy = vi
      .spyOn(orderRepository, 'createOrderItem')
      .mockImplementation(async () => {
        throw new Error('Simulated createOrderItem failure')
      })

    const response = await request(app)
      .post('/api/v1/orders')
      .set('Authorization', `Bearer ${user.token}`)

    expect(response.status).toBe(500)

    // Product stock must remain unchanged because transaction should rollback
    const productRes = await request(app).get(
      `/api/v1/products/${cartItem.product.product.id}`,
    )
    expect(productRes.status).toBe(200)
    expect(productRes.body.stock).toBe(cartItem.product.product.stock)

    // Cart should still contain the item since creating the order item failed
    const getCartResponse = await request(app)
      .get('/api/v1/items')
      .set('Authorization', `Bearer ${user.token}`)

    expect(getCartResponse.status).toBe(200)
    expect(getCartResponse.body.items).toHaveLength(1)
    expect(getCartResponse.body.items[0].id).toBe(cartItem.response.body.id)

    // No orders should have been created for the user
    const ordersResp = await request(app)
      .get('/api/v1/orders')
      .set('Authorization', `Bearer ${user.token}`)
    expect(ordersResp.status).toBe(404)

    spy.mockRestore()
  })

  it('should handles numeric parsing correctly when product prices are passed as numeric strings', async () => {
    const user = await createTestUser()
    const cartItem = await createTestCartItem(user.token, {
      stock: 10,
      quantity: 2,
    })

    const admin = await createTestUser({ role: 'admin' })

    // Update product price to a numeric string
    const priceString = '49.99'
    await request(app)
      .patch(`/api/v1/products/${cartItem.product.product.id}`)
      .set('Authorization', `Bearer ${admin.token}`)
      .send({ price: priceString })

    const response = await request(app)
      .post('/api/v1/orders')
      .set('Authorization', `Bearer ${user.token}`)

    expect(response.status).toBe(201)

    const expectedTotal =
      parseFloat(priceString) * cartItem.response.body.quantity

    expect(response.body.totalPrice).toBe(expectedTotal)
    expect(response.body.items[0].unitPrice).toBe(parseFloat(priceString))
  })
})
