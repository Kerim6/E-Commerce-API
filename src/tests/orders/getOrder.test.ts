import app from '../../server.ts'
import { createTestUser } from '../helpers/authHelpers.ts'
import { createTestOrder } from '../helpers/orderHelper.ts'
import request from 'supertest'

describe('GET /api/v1/orders', () => {
  it('should allow an authenticated user to get all orders', async () => {
    const user = await createTestUser()
    const order = await createTestOrder(user.token)
    const order2 = await createTestOrder(user.token)

    const response = await request(app)
      .get('/api/v1/orders')
      .set('Authorization', `Bearer ${user.token}`)

    expect(response.status).toBe(200)
    expect(response.body).toHaveLength(2)
    expect(response.body.map((orderItem: any) => orderItem.id)).toEqual(
      expect.arrayContaining([order.response.body.id, order2.response.body.id]),
    )
    expect(
      response.body.every((orderItem: any) => Array.isArray(orderItem.items)),
    ).toBe(true)
    expect(
      response.body.every(
        (orderItem: any) => orderItem.userId === user.user.id,
      ),
    ).toBe(true)
    expect(order.response.body.items).toHaveLength(2)
    expect(order2.response.body.items).toHaveLength(2)
  })

  it('should reject unauthenticated request', async () => {
    const response = await request(app).get('/api/v1/orders')

    expect(response.status).toBe(401)
  })

  it('should only return the authenticated user orders', async () => {
    const user1 = await createTestUser()
    const user2 = await createTestUser()
    const user1Order = await createTestOrder(user1.token)
    await createTestOrder(user2.token)

    const response = await request(app)
      .get('/api/v1/orders')
      .set('Authorization', `Bearer ${user1.token}`)

    expect(response.status).toBe(200)
    expect(response.body).toHaveLength(1)
    expect(response.body[0].id).toBe(user1Order.response.body.id)
    expect(
      response.body.every((order: any) => order.userId === user1.user.id),
    ).toBe(true)
  })

  it('should return an empty array when the user has no orders', async () => {
    const user = await createTestUser()

    const response = await request(app)
      .get('/api/v1/orders')
      .set('Authorization', `Bearer ${user.token}`)

    expect(response.status).toBe(404)
  })

  it('should return an order by id with products', async () => {
    const user = await createTestUser()
    const order = await createTestOrder(user.token)

    const response = await request(app)
      .get(`/api/v1/orders/${order.response.body.id}`)
      .set('Authorization', `Bearer ${user.token}`)

    expect(response.status).toBe(200)
    expect(response.body.items).toHaveLength(2)
  })

  it('should return 400 for invalid order id parameter', async () => {
    const user = await createTestUser()

    const response = await request(app)
      .get(`/api/v1/orders/invalid-id-paramater`)
      .set('Authorization', `Bearer ${user.token}`)

    expect(response.status).toBe(400)
  })

  it('should return 404 for non existing order', async () => {
    const user = await createTestUser()

    const response = await request(app)
      .get(`/api/v1/orders/123e4567-e89b-12d3-a456-426614174000`)
      .set('Authorization', `Bearer ${user.token}`)

    expect(response.status).toBe(404)
  })

  it('should reject access to another user"s orders', async () => {
    const user1 = await createTestUser()
    const user2 = await createTestUser()

    const user2Order = await createTestOrder(user2.token)

    const response = await request(app)
      .get(`/api/v1/orders/${user2Order.response.body.id}`)
      .set('Authorization', `Bearer ${user1.token}`)

    expect(response.status).toBe(404)
  })
})
