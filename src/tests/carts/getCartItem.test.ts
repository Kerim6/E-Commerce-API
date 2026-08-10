import app from '../../server.ts'
import request from 'supertest'
import { createTestCartItem } from '../factories/cartFactory.ts'
import { createTestUser } from '../helpers/authHelpers.ts'

describe('GET /api/v1/items', () => {
  it('should allow an authenticated user to get all cart items', async () => {
    const user = await createTestUser()
    const cartItem1 = await createTestCartItem(user.token)
    const cartItem2 = await createTestCartItem(user.token)

    const response = await request(app)
      .get('/api/v1/items')
      .set('Authorization', `Bearer ${user.token}`)

    expect(response.status).toBe(200)
    expect(response.body.items).toHaveLength(2)
    expect(response.body.items.map((i: any) => i.id)).toEqual(
      expect.arrayContaining([
        cartItem1.response.body.id,
        cartItem2.response.body.id,
      ]),
    )
    expect(response.body.items.map((i: any) => i.quantity)).toEqual(
      expect.arrayContaining([
        cartItem1.response.body.quantity,
        cartItem2.response.body.quantity,
      ]),
    )
    expect(response.body.items.map((i: any) => i.productId)).toEqual(
      expect.arrayContaining([
        cartItem1.response.body.productId,
        cartItem2.response.body.productId,
      ]),
    )
  })

  it('should reject unauthenticated request', async () => {
    const response = await request(app).get('/api/v1/items')

    expect(response.status).toBe(401)
  })

  it('should only return the authenticated user cart items', async () => {
    const user1 = await createTestUser()
    const user2 = await createTestUser()

    const user1Item = await createTestCartItem(user1.token)
    await createTestCartItem(user2.token)

    const response = await request(app)
      .get('/api/v1/items')
      .set('Authorization', `Bearer ${user1.token}`)

    expect(response.status).toBe(200)
    expect(response.body.items).toHaveLength(1)
    expect(response.body.items[0].id).toBe(user1Item.response.body.id)
  })

  it('should return an empty array when the user has no cart items', async () => {
    const user = await createTestUser()

    const response = await request(app)
      .get('/api/v1/items')
      .set('Authorization', `Bearer ${user.token}`)

    expect(response.status).toBe(200)
    expect(response.body.items).toEqual(undefined)
  })
})
