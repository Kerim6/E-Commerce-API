import { createTestUser } from '../helpers/authHelpers.ts'
import { createTestCategory } from '../factories/categoryFactory.ts'
import request from 'supertest'
import app from '../../server.ts'

describe('POST /api/v1/categories', () => {
  it('should allow an admin to create a category', async () => {
    const admin = await createTestUser({ role: 'admin' })
    const newCategory = await createTestCategory(admin.token)

    expect(newCategory.response.status).toBe(201)
    expect(newCategory.category.name).toBe(newCategory.input.name)
    expect(newCategory.category.slug).toBe(newCategory.input.slug)
    expect(newCategory.category).toHaveProperty('id')
    expect(newCategory.category).toHaveProperty('createdAt')
  })

  it('should reject a normal user', async () => {
    const user = await createTestUser()
    const category = await createTestCategory(user.token)

    expect(category.response.status).toBe(403)
  })

  it('should reject unauthenticated request', async () => {
    const response = await request(app).post('/api/v1/categories').send({
      name: 'name',
      slug: 'slug',
    })

    expect(response.status).toBe(401)
  })

  it('should reject duplicate name and slug', async () => {
    const admin = await createTestUser({ role: 'admin' })
    const category = await createTestCategory(admin.token)

    const response = await request(app)
      .post('/api/v1/categories')
      .set('Authorization', `Bearer ${admin.token}`)
      .send(category.input)

    expect(response.status).toBe(409)
  })

  it('should validate the request body', async () => {
    const admin = await createTestUser({ role: 'admin' })
    const response = await request(app)
      .post('/api/v1/categories')
      .set('Authorization', `Bearer ${admin.token}`)
      .send({ name: 123, slug: 123 })

    expect(response.status).toBe(400)
  })

  it('should validate empty name', async () => {
    const admin = await createTestUser({ role: 'admin' })
    const response = await request(app)
      .post('/api/v1/categories')
      .set('Authorization', `Bearer ${admin.token}`)
      .send({ name: '', slug: 'electronics' })

    expect(response.status).toBe(400)
  })

  it('should validate empty slug', async () => {
    const admin = await createTestUser({ role: 'admin' })
    const response = await request(app)
      .post('/api/v1/categories')
      .set('Authorization', `Bearer ${admin.token}`)
      .send({ name: 'fasion', slug: '' })

    expect(response.status).toBe(400)
  })
})
