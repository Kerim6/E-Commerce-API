import request from 'supertest'
import app from '../../server.ts'
import { createTestCartItem } from '../factories/cartFactory.ts'
import { createTestUser } from '../helpers/authHelpers.ts'
import { userInfo } from 'node:os'

describe('PATCH /api/v1/items/:id', () => {
  it('should authenticated user update qunatity', async () => {
    const user = await createTestUser()
    const cartItem = await createTestCartItem(user.token)

    const response = await request(app)
      .patch(`/api/v1/items/${cartItem.response.body.id}`)
      .set('Authorization', `Bearer ${user.token}`)
      .send({ quantity: 4 })

    expect(response.status).toBe(200)
    expect(response.body.quantity).toBe(4)
  })

  it('should unauthenticated user cannot update an item', async () => {
    const user = await createTestUser()
    const cartItem = await createTestCartItem(user.token)
    const response = await request(app)
      .patch(`/api/v1/items/${cartItem.response.body.id}`)
      .send({ quantity: 3 })

    expect(response.status).toBe(401)
  })

  it('should return 400 for invalid id parameter', async () => {
    const user = await createTestUser()
    const response = await request(app)
      .patch(`/api/v1/items/invalid-id-parameter`)
      .set('Authorization', `Bearer ${user.token}`)
      .send({ quantity: 2 })

    expect(response.status).toBe(400)
  })

  it('should return 400 for invalid body request', async () => {
    const user = await createTestUser()
    const cartItem = await createTestCartItem(user.token)

    const response = await request(app)
      .patch(`/api/v1/items/invalid-id-parameter`)
      .set('Authorization', `Bearer ${user.token}`)
      .send({ quantity: 'five' })

    expect(response.status).toBe(400)
  })

  it('should update if the quantity equal the stock', async () => {
    const user = await createTestUser()
    const cartItem = await createTestCartItem(user.token, { stock: 20 })

    const response = await request(app)
      .patch(`/api/v1/items/${cartItem.response.body.id}`)
      .set('Authorization', `Bearer ${user.token}`)
      .send({ quantity: 20 })

    expect(response.status).toBe(200)
  })

  it('should reject qunatity that exceeds stock', async () => {
    const user = await createTestUser()
    const cartItem = await createTestCartItem(user.token, { stock: 10 })

    const response = await request(app)
      .patch(`/api/v1/items/${cartItem.response.body.id}`)
      .set('Authorization', `Bearer ${user.token}`)
      .send({ quantity: 15 })

    expect(response.status).toBe(409)
  })

  it('should remove the item if the quantity is zero', async () => {
    const user = await createTestUser()
    const cartItem = await createTestCartItem(user.token)

    const response = await request(app)
      .patch(`/api/v1/items/${cartItem.response.body.id}`)
      .set('Authorization', `Bearer ${user.token}`)
      .send({ quantity: 0 })

    expect(response.status).toBe(200)
    expect(response.body.items).toBe(undefined)
  })

  it('should reject negative quantity', async () => {
    const user = await createTestUser()
    const cartItem = await createTestCartItem(user.token)

    const response = await request(app)
      .patch(`/api/v1/items/${cartItem.response.body.id}`)
      .set('Authorization', `Bearer ${user.token}`)
      .send({ quantity: -4 })

    expect(response.status).toBe(400)
  })

  it('should return 404 for nonexist item', async () => {
    const user = await createTestUser()

    const response = await request(app)
      .patch(`/api/v1/items/123e4567-e89b-12d3-a456-426614174000`)
      .set('Authorization', `Bearer ${user.token}`)
      .send({ quantity: 2 })

    expect(response.status).toBe(404)
  })

  it("should reject user A from updating user's B items", async () => {
    const user1 = await createTestUser()
    const user2 = await createTestUser()
    const user2Item = await createTestCartItem(user2.token)

    const response = await request(app)
      .patch(`/api/v1/items/${user2Item.response.body.id}`)
      .set('Authorization', `Bearer ${user1.token}`)
      .send({ quantity: 3 })

    expect(response.status).toBe(403)
  })
})
