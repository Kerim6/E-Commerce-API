import { createTestUser } from '../helpers/authHelpers.ts'
import { createTestCategory } from '../factories/categoryFactory.ts'
import request from 'supertest'
import app from '../../server.ts'

describe('get /api/v1/categories', () => {
  it('should get all categories', async () => {
    const user = await createTestUser()

    const admin = await createTestUser({ role: 'admin' })
    await createTestCategory(admin.token)
    await createTestCategory(admin.token)
    await createTestCategory(admin.token)

    const response = await request(app)
      .get('/api/v1/categories')
      .set('Authorization', `Bearer ${user.token}`)

    expect(response.status).toBe(200)
    expect(Array.isArray(response.body)).toBe(true)
    expect(response.body.length).toBeGreaterThanOrEqual(2)
  })

  it('should allow unauthenticated request to list categories', async () => {
    const response = await request(app).get('/api/v1/categories')

    expect(response.status).toBe(200)
    expect(Array.isArray(response.body)).toBe(true)
  })

  it('should get one category', async () => {
    const user = await createTestUser()
    const admin = await createTestUser({ role: 'admin' })
    const category = await createTestCategory(admin.token)

    const response = await request(app)
      .get(`/api/v1/categories/${category.category.id}`)
      .set('Authorization', `Bearer ${user.token}`)

    expect(response.status).toBe(200)
    expect(response.body.id).toBe(category.category.id)
    expect(response.body.name).toBe(category.input.name)
    expect(response.body.slug).toBe(category.input.slug)
  })

  it('should reject an invalid id', async () => {
    const user = await createTestUser()

    const response = await request(app)
      .get('/api/v1/categories/invalid-id')
      .set('Authorization', `Bearer ${user.token}`)

    expect(response.status).toBe(400)
  })

  it('should return 404 when category does not exist', async () => {
    const user = await createTestUser()

    const response = await request(app)
      .get('/api/v1/categories/123e4567-e89b-12d3-a456-426614174000')
      .set('Authorization', `Bearer ${user.token}`)

    expect(response.status).toBe(404)
  })
})
