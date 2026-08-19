import { createTestUser } from '../helpers/authHelpers.ts'
import { createTestCategory } from '../factories/categoryFactory.ts'
import request from 'supertest'
import app from '../../server.ts'

describe('DELETE /api/v1/categories/:id', () => {
  it('should allow an admin to delete a category', async () => {
    const admin = await createTestUser({ role: 'admin' })
    const category = await createTestCategory(admin.token)

    const response = await request(app)
      .delete(`/api/v1/categories/${category.category.id}`)
      .set('Authorization', `Bearer ${admin.token}`)

    expect(response.status).toBe(204)
  })

  it('should reject normal user to delete a category', async () => {
    const user = await createTestUser()

    const admin = await createTestUser({ role: 'admin' })
    const category = await createTestCategory(admin.token)

    const response = await request(app)
      .delete(`/api/v1/categories/${category.category.id}`)
      .set('Authorization', `Bearer ${user.token}`)

    expect(response.status).toBe(403)
  })

  it('should return 404 for not found category', async () => {
    const admin = await createTestUser({ role: 'admin' })
    const response = await request(app)
      .delete(`/api/v1/categories/123e4567-e89b-12d3-a456-426614174000`)
      .set('Authorization', `Bearer ${admin.token}`)

    expect(response.status).toBe(404)
  })

  it('should reject invalid id parameter', async () => {
    const admin = await createTestUser({ role: 'admin' })

    const response = await request(app)
      .delete(`/api/v1/categories/invalid-id-parameter`)
      .set('Authorization', `Bearer ${admin.token}`)

    expect(response.status).toBe(400)
  })

  it('should reject unauthenticated request', async () => {
    const admin = await createTestUser({ role: 'admin' })
    const category = await createTestCategory(admin.token)

    const response = await request(app).delete(
      `/api/v1/categories/${category.category.id}`,
    )

    expect(response.status).toBe(401)
  })
})
