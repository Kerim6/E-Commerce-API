import app from '../../server.ts'
import { createTestCartItem } from '../factories/cartFactory.ts'
import { createTestCategory } from '../factories/categoryFactory.ts'
import { createTestProduct } from '../factories/productFactory.ts'
import { createTestUser } from '../helpers/authHelpers.ts'
import request from 'supertest'

describe('POST /api/v1/items', () => {
  it('should allow a user to add items to the cartItems', async () => {
    const user = await createTestUser()
    const cartItem = await createTestCartItem(user.token)

    expect(cartItem.response.status).toBe(201)
  })

  it('should reject an unauthenticated user', async () => {
    const response = await request(app)
      .post('/api/v1/items')
      .send({ productId: '123e4567-e89b-12d3-a456-426614174000', quantity: 10 })

    expect(response.status).toBe(401)
  })

  it('should return 404 if the product does not exist', async () => {
    const user = await createTestUser()

    const response = await request(app)
      .post('/api/v1/items')
      .set('Authorization', `Bearer ${user.token}`)
      .send({ productId: '123e4567-e89b-12d3-a456-426614174000', quantity: 1 })

    expect(response.status).toBe(404)
  })

  it('should return 400 if the product ID is invalid', async () => {
    const user = await createTestUser()

    const response = await request(app)
      .post('/api/v1/items')
      .set('Authorization', `Bearer ${user.token}`)
      .send({ productId: 'invalid-id-parameter', quantity: 1 })

    expect(response.status).toBe(400)
  })

  it('should return 400 if the quantity is negative number', async () => {
    const user = await createTestUser()
    const cartItem = await createTestCartItem(user.token, { quantity: -1 })

    expect(cartItem.response.status).toBe(400)
    expect(cartItem.response.body.message).toBe(
      'Quantity should not be negative or zero',
    )
  })

  it('should return 400 if the quantity is zero', async () => {
    const user = await createTestUser()
    const cartItem = await createTestCartItem(user.token, { quantity: 0 })

    expect(cartItem.response.status).toBe(400)
    expect(cartItem.response.body.message).toBe(
      'Quantity should not be negative or zero',
    )
  })

  it('should return 409 if quantity exceeds the available stock', async () => {
    const user = await createTestUser()
    const cartItem = await createTestCartItem(user.token, {
      stock: 5,
      quantity: 6,
    })

    expect(cartItem.response.status).toBe(409)
    expect(cartItem.response.body.message).toBe(
      'The required quantity is not available',
    )
  })

  it('should return 201 if quantity equals stock', async () => {
    const user = await createTestUser()
    const cartItem = await createTestCartItem(user.token, {
      stock: 5,
      quantity: 5,
    })

    expect(cartItem.response.status).toBe(201)
  })

  it('should update the quantity when adding same product again', async () => {
    const user = await createTestUser()
    const cartItem = await createTestCartItem(user.token, {
      stock: 3,
      quantity: 1,
    })

    const response = await request(app)
      .post('/api/v1/items')
      .set('Authorization', `Bearer ${user.token}`)
      .send({ productId: cartItem.product.product.id, quantity: 1 })

    expect(response.status).toBe(201)
    expect(response.body.quantity).toBe(2)
  })

  it("should keep each user's cart separate", async () => {
    const user = await createTestUser()
    const user2 = await createTestUser()
    const cartItem = await createTestCartItem(user.token)
    const cartItem2 = await createTestCartItem(user2.token)

    expect(cartItem.response.status).toBe(201)

    expect(cartItem.response.body.cartId).not.toBe(
      cartItem2.response.body.cartId,
    )
  })
})
