import { createTestUser } from '../helpers/authHelpers.ts'
import { createTestCategory } from '../factories/categoryFactory.ts'
import request from 'supertest'
import app from '../../server.ts'

describe('PUT /api/v1/categories/:id', () => {
  it('should allow an admin to update a category', async () => {
    const admin = await createTestUser({ role: 'admin' })
    const category = await createTestCategory(admin.token)

    const response = await request(app)
      .put(`/api/v1/categories/${category.category.id}`)
      .set('Authorization', `Bearer ${admin.token}`)
      .send({ name: 'Fasion', slug: 'fasion' })

    expect(response.status).toBe(200)
    expect(response.body.id).toBe(category.category.id)
    expect(response.body.updatedAt).not.toBe(category.category.updatedAt)
    expect(response.body.name).toBe('Fasion')
    expect(response.body.slug).toBe('fasion')
  })

  it('should reject a normal user to update a category', async () => {
    const user = await createTestUser()
    const admin = await createTestUser({ role: 'admin' })
    const category = await createTestCategory(admin.token)

    const response = await request(app)
      .put(`/api/v1/categories/${category.category.id}`)
      .set('Authorization', `Bearer ${user.token}`)
      .send({ name: 'Fasion', slug: 'fasion' })

    expect(response.status).toBe(403)
  })

  it('should reject unauthenticated request', async () => {
    const admin = await createTestUser({ role: 'admin' })
    const category = await createTestCategory(admin.token)
    const response = await request(app)
      .put(`/api/v1/categories/${category.category.id}`)
      .send({
        name: 'name',
        slug: 'slug',
      })

    expect(response.status).toBe(401)
  })

  it('should reject duplicate name and slug', async () => {
    const admin = await createTestUser({ role: 'admin' })
    const category1 = await createTestCategory(admin.token)
    const category2 = await createTestCategory(admin.token)

    const response = await request(app)
      .put(`/api/v1/categories/${category2.category.id}`)
      .set('Authorization', `Bearer ${admin.token}`)
      .send(category1.input)

    expect(response.status).toBe(409)
  })

  it('should validate the request body', async () => {
    const admin = await createTestUser({ role: 'admin' })
    const category = await createTestCategory(admin.token)
    const response = await request(app)
      .put(`/api/v1/categories/${category.category.id}`)
      .set('Authorization', `Bearer ${admin.token}`)
      .send({ name: 123, slug: 123 })

    expect(response.status).toBe(400)
  })

  it('should validate empty name', async () => {
    const admin = await createTestUser({ role: 'admin' })
    const category = await createTestCategory(admin.token)

    const response = await request(app)
      .put(`/api/v1/categories/${category.category.id}`)
      .set('Authorization', `Bearer ${admin.token}`)
      .send({ name: '', slug: 'electronics' })

    expect(response.status).toBe(400)
  })

  it('should validate empty slug', async () => {
    const admin = await createTestUser({ role: 'admin' })
    const category = await createTestCategory(admin.token)

    const response = await request(app)
      .put(`/api/v1/categories/${category.category.id}`)
      .set('Authorization', `Bearer ${admin.token}`)
      .send({ name: 'fasion', slug: '' })

    expect(response.status).toBe(400)
  })

  it('should reject invalid id parameter', async () => {
    const admin = await createTestUser({ role: 'admin' })

    const response = await request(app)
      .put('/api/v1/categories/not-a-uuid')
      .set('Authorization', `Bearer ${admin.token}`)
      .send({
        name: 'Electronics',
        slug: 'electronics',
      })

    expect(response.status).toBe(400)
  })

  it('should return 404 when category does not exist', async () => {
    const admin = await createTestUser({ role: 'admin' })

    const response = await request(app)
      .put('/api/v1/categories/123e4567-e89b-12d3-a456-426614174000')
      .set('Authorization', `Bearer ${admin.token}`)
      .send({
        name: 'Electronics',
        slug: 'electronics',
      })

    expect(response.status).toBe(404)
  })
})
