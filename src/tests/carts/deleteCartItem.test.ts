import { createTestCartItem } from '../factories/cartFactory.ts'
import { createTestUser } from '../helpers/authHelpers.ts'
import request from 'supertest'
import app from '../../server.ts'

describe('DELETE /api/v1/items/:id', () => {
  it('should delete only the requested item', async () => {
    const user = await createTestUser()

    const item1 = await createTestCartItem(user.token)
    const item2 = await createTestCartItem(user.token)

    const deleteResponse = await request(app)
      .delete(`/api/v1/items/${item1.response.body.id}`)
      .set('Authorization', `Bearer ${user.token}`)

    expect(deleteResponse.status).toBe(204)

    const getResponse = await request(app)
      .get('/api/v1/items')
      .set('Authorization', `Bearer ${user.token}`)

    expect(getResponse.status).toBe(200)
    expect(getResponse.body.items).toHaveLength(1)
    expect(getResponse.body.items[0].id).toBe(item2.response.body.id)
  })

  it('should reject an unauthenticated user', async () => {
    const user = await createTestUser()
    const cartItem = await createTestCartItem(user.token)

    const response = await request(app).delete(
      `/api/v1/items/${cartItem.response.body.id}`,
    )

    expect(response.status).toBe(401)
  })

  it('should return 404 for not found item', async () => {
    const user = await createTestUser()

    const response = await request(app)
      .delete('/api/v1/items/123e4567-e89b-12d3-a456-426614174000')
      .set('Authorization', `Bearer ${user.token}`)

    expect(response.status).toBe(404)
  })

  it('should return 400 for invalid id parameter', async () => {
    const user = await createTestUser()

    const response = await request(app)
      .delete('/api/v1/items/invalid-id-parameter')
      .set('Authorization', `Bearer ${user.token}`)

    expect(response.status).toBe(400)
  })

  it('should reject a user from deleting another user"s item', async () => {
    const user1 = await createTestUser()
    const user2 = await createTestUser()
    const user1Item = await createTestCartItem(user1.token)

    const response = await request(app)
      .delete(`/api/v1/items/${user1Item.response.body.id}`)
      .set('Authorization', `Bearer ${user2.token}`)

    expect(response.status).toBe(403)
  })
})
