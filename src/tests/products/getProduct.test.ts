import app from '../../server.ts'
import request from 'supertest'
import { createTestUser } from '../helpers/authHelpers.ts'
import { createTestCategory } from '../factories/categoryFactory.ts'
import { createTestProduct } from '../factories/productFactory.ts'

describe('GET /api/v1/products', () => {
  it('should get all products without authentication or authorization', async () => {
    const admin = await createTestUser({ role: 'admin' })
    const category = await createTestCategory(admin.token)
    await createTestProduct(admin.token, { categoryId: category.category.id })
    await createTestProduct(admin.token, { categoryId: category.category.id })
    await createTestProduct(admin.token, { categoryId: category.category.id })
    const response = await request(app).get('/api/v1/products/')

    expect(response.status).toBe(200)
    expect(Array.isArray(response.body)).toBe(true)
    expect(response.body.length).toBeGreaterThanOrEqual(3)
  })

  it('should return a product by id', async () => {
    const admin = await createTestUser({ role: 'admin' })
    const category = await createTestCategory(admin.token)
    const product = await createTestProduct(admin.token, {
      categoryId: category.category.id,
    })

    const response = await request(app).get(
      `/api/v1/products/${product.product.id}`,
    )

    expect(response.status).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String),
        slug: expect.any(String),
        description: expect.any(String),
        price: expect.any(String),
        stock: expect.any(Number),
        categoryId: expect.any(String),
      }),
    )
  })

  it('should reject invalid id parameter', async () => {
    const response = await request(app).get(
      `/api/v1/products/inavlid-id-parameter`,
    )

    expect(response.status).toBe(400)
  })

  it('should return 404 when a product does not exist', async () => {
    const response = await request(app).get(
      `/api/v1/products/123e4567-e89b-12d3-a456-426614174000`,
    )

    expect(response.status).toBe(404)
  })
})
