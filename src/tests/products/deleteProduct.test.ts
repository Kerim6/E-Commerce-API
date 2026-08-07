import { createTestCategory } from '../factories/categoryFactory.ts'
import { createTestProduct } from '../factories/productFactory.ts'
import { createTestUser } from '../helpers/authHelpers.ts'
import request from 'supertest'
import app from '../../server.ts'

describe('DELETE /api/v1/products/:id', () => {
  it('should allow an admin to delete a product', async () => {
    const admin = await createTestUser({ role: 'admin' })
    const category = await createTestCategory(admin.token)
    const product = await createTestProduct(admin.token, {
      categoryId: category.category.id,
    })

    const response = await request(app)
      .delete(`/api/v1/products/${product.product.id}`)
      .set('Authorization', `Bearer ${admin.token}`)

    expect(response.status).toBe(204)
    expect(response.body).toEqual({})
  })

  it('should reject normal user to delete a product', async () => {
    const user = await createTestUser()

    const admin = await createTestUser({ role: 'admin' })
    const category = await createTestCategory(admin.token)
    const product = await createTestProduct(admin.token, {
      categoryId: category.category.id,
    })

    const response = await request(app)
      .delete(`/api/v1/products/${product.product.id}`)
      .set('Authorization', `Bearer ${user.token}`)

    expect(response.status).toBe(403)
  })

  it('should return 404 for not found product', async () => {
    const admin = await createTestUser({ role: 'admin' })
    const response = await request(app)
      .delete(`/api/v1/products/123e4567-e89b-12d3-a456-426614174000`)
      .set('Authorization', `Bearer ${admin.token}`)

    expect(response.status).toBe(404)
  })

  it('should reject invalid id parameter', async () => {
    const admin = await createTestUser({ role: 'admin' })

    const response = await request(app)
      .delete(`/api/v1/products/invalid-id-parameter`)
      .set('Authorization', `Bearer ${admin.token}`)

    expect(response.status).toBe(400)
  })

  it('should reject unauthenticated request', async () => {
    const admin = await createTestUser({ role: 'admin' })
    const category = await createTestCategory(admin.token)
    const product = await createTestProduct(admin.token, {
      categoryId: category.category.id,
    })

    const response = await request(app).delete(
      `/api/v1/products/${product.product.id}`,
    )

    expect(response.status).toBe(401)
  })
})
