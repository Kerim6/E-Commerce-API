import app from '../../server.ts'
import request from 'supertest'
import { createTestCategory } from '../factories/categoryFactory.ts'
import { createTestProduct } from '../factories/productFactory.ts'
import { createTestUser } from '../helpers/authHelpers.ts'

describe('POST /api/v1/products/', () => {
  it('should allow an admin to create a product', async () => {
    const admin = await createTestUser({ role: 'admin' })
    const category = await createTestCategory(admin.token)
    const product = await createTestProduct(admin.token, {
      categoryId: category.category.id,
    })

    expect(product.response.status).toBe(201)
    expect(product.product.name).toBe(product.input.name)
    expect(product.product.slug).toBe(product.input.slug)
    expect(product.product.description).toBe(product.input.description)
    expect(parseFloat(product.product.price)).toBe(product.input.price)
    expect(product.product.stock).toBe(product.input.stock)
    expect(product.product.categoryId).toBe(product.input.categoryId)
    expect(product.product).toHaveProperty('id')
    expect(product.product).toHaveProperty('createdAt')
  })

  it('should reject a normal user', async () => {
    const user = await createTestUser()
    const product = await createTestProduct(user.token)

    expect(product.response.status).toBe(403)
  })

  it('should reject unauthenticated request', async () => {
    const response = await request(app).post('/api/v1/products/').send({
      name: 'productName',
      slug: 'porductSlug',
      description: 'productDescription',
      price: 99.99,
      stock: 10,
      categoryId: '123e4567-e89b-12d3-a456-426614174000',
    })

    expect(response.status).toBe(401)
  })

  it('should reject duplicate name', async () => {
    const admin = await createTestUser({ role: 'admin' })
    const category = await createTestCategory(admin.token)
    const product1 = await createTestProduct(admin.token, {
      categoryId: category.category.id,
    })
    const product2 = await createTestProduct(admin.token, {
      name: product1.product.name,
      categoryId: category.category.id,
    })

    expect(product2.response.status).toBe(409)
  })

  it('should reject duplicate slug', async () => {
    const admin = await createTestUser({ role: 'admin' })
    const category = await createTestCategory(admin.token)
    const product1 = await createTestProduct(admin.token, {
      categoryId: category.category.id,
    })
    const product2 = await createTestProduct(admin.token, {
      slug: product1.product.slug,
      categoryId: category.category.id,
    })

    expect(product2.response.status).toBe(409)
  })

  it('should reject invalid categoryId', async () => {
    const admin = await createTestUser({ role: 'admin' })
    const product = await createTestProduct(admin.token, {
      categoryId: 'invalid-id-parameter',
    })

    expect(product.response.status).toBe(400)
  })

  it('should reject non-existent category', async () => {
    const admin = await createTestUser({ role: 'admin' })
    const product = await createTestProduct(admin.token, {
      categoryId: '123e4567-e89b-12d3-a456-426614174000',
    })

    expect(product.response.status).toBe(404)
  })

  it('should validate request body', async () => {
    const admin = await createTestUser({ role: 'admin' })
    const product = await createTestProduct(admin.token, {
      name: 123 as unknown as string,
      slug: 123 as unknown as string,
      description: 123 as unknown as string,
      price: 'price' as unknown as number,
      stock: 'stock' as unknown as number,
      categoryId: 123 as unknown as string,
    })

    expect(product.response.status).toBe(400)
  })

  it('should validate negative stock', async () => {
    const admin = await createTestUser({ role: 'admin' })
    const category = await createTestCategory(admin.token)
    const product = await createTestProduct(admin.token, {
      stock: -55,
      categoryId: category.category.id,
    })

    expect(product.response.status).toBe(400)
  })

  it('should validate negative price', async () => {
    const admin = await createTestUser({ role: 'admin' })
    const category = await createTestCategory(admin.token)
    const product = await createTestProduct(admin.token, {
      price: -55,
      categoryId: category.category.id,
    })

    expect(product.response.status).toBe(400)
  })

  it('should validate empty name', async () => {
    const admin = await createTestUser({ role: 'admin' })
    const category = await createTestCategory(admin.token)
    const product = await createTestProduct(admin.token, {
      name: '',
      categoryId: category.category.id,
    })

    expect(product.response.status).toBe(400)
  })

  it('should validate empty slug', async () => {
    const admin = await createTestUser({ role: 'admin' })
    const category = await createTestCategory(admin.token)
    const product = await createTestProduct(admin.token, {
      slug: '',
      categoryId: category.category.id,
    })

    expect(product.response.status).toBe(400)
  })
})
