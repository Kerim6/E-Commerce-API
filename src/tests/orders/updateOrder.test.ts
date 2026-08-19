import request from 'supertest'
import app from '../../server.ts'
import { createTestUser } from '../helpers/authHelpers.ts'
import { createTestOrder } from '../helpers/orderHelper.ts'

describe('PATCH /api/v1/orders/:id/cancel', () => {
  it('should allow to cancel an order if status is pending', async () => {
    const user = await createTestUser()
    const order = await createTestOrder(user.token)

    const response = await request(app)
      .patch(`/api/v1/orders/${order.response.body.id}/cancel`)
      .set('Authorization', `Bearer ${user.token}`)

    expect(response.status).toBe(200)
    expect(response.body.status).toBe('cancelled')
  })

  it('should allow to cancel an order if status is processing', async () => {
    const user = await createTestUser()
    const order = await createTestOrder(user.token)

    const admin = await createTestUser({ role: 'admin' })

    await request(app)
      .patch(`/api/v1/orders/${order.response.body.id}/status`)
      .set('Authorization', `Bearer ${admin.token}`)
      .send({ status: 'processing' })

    const response = await request(app)
      .patch(`/api/v1/orders/${order.response.body.id}/cancel`)
      .set('Authorization', `Bearer ${user.token}`)

    expect(response.status).toBe(200)
    expect(response.body.status).toBe('cancelled')
  })

  it('should reject to cancel an order if status is shipped', async () => {
    const user = await createTestUser()
    const order = await createTestOrder(user.token)

    const admin = await createTestUser({ role: 'admin' })
    await request(app)
      .patch(`/api/v1/orders/${order.response.body.id}/status`)
      .set('Authorization', `Bearer ${admin.token}`)
      .send({ status: 'processing' })

    await request(app)
      .patch(`/api/v1/orders/${order.response.body.id}/status`)
      .set('Authorization', `Bearer ${admin.token}`)
      .send({ status: 'shipped' })

    const response = await request(app)
      .patch(`/api/v1/orders/${order.response.body.id}/cancel`)
      .set('Authorization', `Bearer ${user.token}`)

    expect(response.status).toBe(403)
  })

  it('should reject to cancel an order if status is cancelled', async () => {
    const user = await createTestUser()
    const order = await createTestOrder(user.token)

    const admin = await createTestUser({ role: 'admin' })
    await request(app)
      .patch(`/api/v1/orders/${order.response.body.id}/status`)
      .set('Authorization', `Bearer ${admin.token}`)
      .send({ status: 'cancelled' })

    const response = await request(app)
      .patch(`/api/v1/orders/${order.response.body.id}/cancel`)
      .set('Authorization', `Bearer ${user.token}`)

    expect(response.status).toBe(403)
  })

  it('should reject to cancel an order if status is delivered', async () => {
    const user = await createTestUser()
    const order = await createTestOrder(user.token)

    const admin = await createTestUser({ role: 'admin' })
    await request(app)
      .patch(`/api/v1/orders/${order.response.body.id}/status`)
      .set('Authorization', `Bearer ${admin.token}`)
      .send({ status: 'processing' })
    await request(app)
      .patch(`/api/v1/orders/${order.response.body.id}/status`)
      .set('Authorization', `Bearer ${admin.token}`)
      .send({ status: 'shipped' })
    await request(app)
      .patch(`/api/v1/orders/${order.response.body.id}/status`)
      .set('Authorization', `Bearer ${admin.token}`)
      .send({ status: 'delivered' })

    const response = await request(app)
      .patch(`/api/v1/orders/${order.response.body.id}/cancel`)
      .set('Authorization', `Bearer ${user.token}`)

    expect(response.status).toBe(403)
  })

  it('should reject unauthenticated request', async () => {
    const response = await request(app).patch(
      `/api/v1/orders/123e4567-e89b-12d3-a456-426614174000/cancel`,
    )

    expect(response.status).toBe(401)
  })

  it('should reject invalid order id paramter', async () => {
    const user = await createTestUser()

    const response = await request(app)
      .patch(`/api/v1/orders/invalid-id/cancel`)
      .set('Authorization', `Bearer ${user.token}`)

    expect(response.status).toBe(400)
  })

  it("should reject a user from cancelling another user's order", async () => {
    const user1 = await createTestUser()
    const user2 = await createTestUser()

    const order = await createTestOrder(user1.token)

    const response = await request(app)
      .patch(`/api/v1/orders/${order.response.body.id}/cancel`)
      .set('Authorization', `Bearer ${user2.token}`)

    expect(response.status).toBe(403)
  })

  it("should reject a user from cancelling another user's order", async () => {
    const user1 = await createTestUser()
    const user2 = await createTestUser()

    const order = await createTestOrder(user1.token)

    const response = await request(app)
      .patch(`/api/v1/orders/${order.response.body.id}/cancel`)
      .set('Authorization', `Bearer ${user2.token}`)

    expect(response.status).toBe(403)
  })

  it('should return 404 when order does not exist', async () => {
    const user = await createTestUser()

    const response = await request(app)
      .patch('/api/v1/orders/123e4567-e89b-12d3-a456-426614174000/cancel')
      .set('Authorization', `Bearer ${user.token}`)

    expect(response.status).toBe(404)
  })
})

describe('PATCH /api/v1/orders/id/status', () => {
  it('should allow admin to change any user"s order status', async () => {
    const user = await createTestUser()
    const order = await createTestOrder(user.token)

    const admin = await createTestUser({ role: 'admin' })

    const response = await request(app)
      .patch(`/api/v1/orders/${order.response.body.id}/status`)
      .set('Authorization', `Bearer ${admin.token}`)
      .send({ status: 'processing' })

    expect(response.status).toBe(200)
  })

  it('should reject user to change their order status', async () => {
    const user = await createTestUser()
    const order = await createTestOrder(user.token)

    const response = await request(app)
      .patch(`/api/v1/orders/${order.response.body.id}/status`)
      .set('Authorization', `Bearer ${user.token}`)
      .send({ status: 'processing' })

    expect(response.status).toBe(403)
  })

  it('should reject an invalid order status', async () => {
    const user = await createTestUser()
    const order = await createTestOrder(user.token)
    const admin = await createTestUser({ role: 'admin' })

    const response = await request(app)
      .patch(`/api/v1/orders/${order.response.body.id}/status`)
      .set('Authorization', `Bearer ${admin.token}`)
      .send({ status: 'invalid-status' })

    expect(response.status).toBe(400)
  })

  it('should reject unauthenticated request', async () => {
    const response = await request(app)
      .patch('/api/v1/orders/123e4567-e89b-12d3-a456-426614174000/status')
      .send({ status: 'processing' })

    expect(response.status).toBe(401)
  })

  it('should reject invalid order id parameter', async () => {
    const admin = await createTestUser({ role: 'admin' })

    const response = await request(app)
      .patch('/api/v1/orders/invalid-id/status')
      .set('Authorization', `Bearer ${admin.token}`)
      .send({ status: 'processing' })

    expect(response.status).toBe(400)
  })

  it('should return 404 when order does not exist', async () => {
    const admin = await createTestUser({ role: 'admin' })

    const response = await request(app)
      .patch('/api/v1/orders/123e4567-e89b-12d3-a456-426614174000/status')
      .set('Authorization', `Bearer ${admin.token}`)
      .send({ status: 'processing' })

    expect(response.status).toBe(404)
  })
})
