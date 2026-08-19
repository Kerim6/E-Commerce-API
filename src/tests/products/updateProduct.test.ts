import app from '../../server.ts'
import request from 'supertest'
import { createTestCategory } from '../factories/categoryFactory.ts'
import { createTestProduct } from '../factories/productFactory.ts'
import { createTestUser } from '../helpers/authHelpers.ts'

describe('PATCH /api/v1/products/:id', () => {
  it('should allow an admin to update a product', async () => {
    const admin = await createTestUser({ role: 'admin' })
    const category = await createTestCategory(admin.token)
    const product = await createTestProduct(admin.token, {
      categoryId: category.category.id,
    })

    const response = await request(app)
      .patch(`/api/v1/products/${product.product.id}`)
      .set('Authorization', `Bearer ${admin.token}`)
      .send({
        name: 'updatedName',
        slug: 'updatedSlug',
        description: 'updatedDescription',
        price: 250.99,
        stock: 100,
      })
    expect(response.status).toBe(200)
    expect(response.body.id).toBe(product.product.id)
    expect(response.body.updatedAt).toBe(product.product.updatedAt)
    expect(response.body.name).toBe('updatedName')
    expect(response.body.slug).toBe('updatedSlug')
    expect(response.body.description).toBe('updatedDescription')
    expect(parseFloat(response.body.price)).toBe(250.99)
    expect(response.body.stock).toBe(100)
  })

  it('should reject a normal user to update a product', async () => {
    const user = await createTestUser()
    const admin = await createTestUser({ role: 'admin' })
    const category = await createTestCategory(admin.token)
    const product = await createTestProduct(admin.token, {
      categoryId: category.category.id,
    })

    const response = await request(app)
      .patch(`/api/v1/products/${product.product.id}`)
      .set('Authorization', `Bearer ${user.token}`)
      .send({
        name: 'updatedName',
        slug: 'updatedSlug',
        description: 'updatedDescription',
        price: 250.99,
        stock: 100,
        updatedAt: new Date(),
      })

    expect(response.status).toBe(403)
  })

  it('should reject unauthenticated request', async () => {
    const admin = await createTestUser({ role: 'admin' })
    const category = await createTestCategory(admin.token)
    const product = await createTestProduct(admin.token, {
      categoryId: category.category.id,
    })

    const response = await request(app)
      .patch(`/api/v1/products/${product.product.id}`)
      .send({
        name: 'updatedName',
        slug: 'updatedSlug',
        description: 'updatedDescription',
        price: 250.99,
        stock: 100,
        updatedAt: new Date(),
      })

    expect(response.status).toBe(401)
  })

  it('should reject duplicate name and slug', async () => {
    const admin = await createTestUser({ role: 'admin' })
    const category = await createTestCategory(admin.token)
    const product1 = await createTestProduct(admin.token, {
      categoryId: category.category.id,
    })
    const product2 = await createTestProduct(admin.token, {
      categoryId: category.category.id,
    })

    const response = await request(app)
      .patch(`/api/v1/products/${product1.product.id}`)
      .set('Authorization', `Bearer ${admin.token}`)
      .send({ name: product2.product.name, slug: product2.product.slug })

    expect(response.status).toBe(409)
  })

  it('should reject duplicate name', async () => {
    const admin = await createTestUser({ role: 'admin' })
    const category = await createTestCategory(admin.token)
    const product1 = await createTestProduct(admin.token, {
      categoryId: category.category.id,
    })
    const product2 = await createTestProduct(admin.token, {
      categoryId: category.category.id,
    })

    const response = await request(app)
      .patch(`/api/v1/products/${product1.product.id}`)
      .set('Authorization', `Bearer ${admin.token}`)
      .send({ name: product2.product.name })

    expect(response.status).toBe(409)
  })

  it('should reject duplicate slug', async () => {
    const admin = await createTestUser({ role: 'admin' })
    const category = await createTestCategory(admin.token)
    const product1 = await createTestProduct(admin.token, {
      categoryId: category.category.id,
    })
    const product2 = await createTestProduct(admin.token, {
      categoryId: category.category.id,
    })

    const response = await request(app)
      .patch(`/api/v1/products/${product1.product.id}`)
      .set('Authorization', `Bearer ${admin.token}`)
      .send({ slug: product2.product.slug })

    expect(response.status).toBe(409)
  })

  it('should validate the request body', async () => {
    const admin = await createTestUser({ role: 'admin' })
    const category = await createTestCategory(admin.token)
    const product = await createTestProduct(admin.token, {
      categoryId: category.category.id,
    })

    const response = await request(app)
      .patch(`/api/v1/products/${product.product.id}`)
      .set('Authorization', `Bearer ${admin.token}`)
      .send({
        name: 123,
        slug: 123,
        description: 123,
        price: 'abc',
        stock: 'abc',
      })

    expect(response.status).toBe(400)
  })

  it('should validate empty name', async () => {
    const admin = await createTestUser({ role: 'admin' })
    const category = await createTestCategory(admin.token)
    const product = await createTestProduct(admin.token, {
      categoryId: category.category.id,
    })

    const reponse = await request(app)
      .patch(`/api/v1/products/${product.product.id}`)
      .set('Authorization', `Bearer ${admin.token}`)
      .send({ name: '' })

    expect(reponse.status).toBe(400)
  })

  it('should validate empty slug', async () => {
    const admin = await createTestUser({ role: 'admin' })
    const category = await createTestCategory(admin.token)
    const product = await createTestProduct(admin.token, {
      categoryId: category.category.id,
    })

    const reponse = await request(app)
      .patch(`/api/v1/products/${product.product.id}`)
      .set('Authorization', `Bearer ${admin.token}`)
      .send({ slug: '' })

    expect(reponse.status).toBe(400)
  })

  it('should allow empty description', async () => {
    const admin = await createTestUser({ role: 'admin' })
    const category = await createTestCategory(admin.token)
    const product = await createTestProduct(admin.token, {
      categoryId: category.category.id,
    })

    const reponse = await request(app)
      .patch(`/api/v1/products/${product.product.id}`)
      .set('Authorization', `Bearer ${admin.token}`)
      .send({ description: '' })

    expect(reponse.status).toBe(200)
  })

  it('should reject negative price', async () => {
    const admin = await createTestUser({ role: 'admin' })
    const category = await createTestCategory(admin.token)
    const product = await createTestProduct(admin.token, {
      categoryId: category.category.id,
    })

    const reponse = await request(app)
      .patch(`/api/v1/products/${product.product.id}`)
      .set('Authorization', `Bearer ${admin.token}`)
      .send({ price: -255 })

    expect(reponse.status).toBe(400)
  })

  it('should reject negative stock', async () => {
    const admin = await createTestUser({ role: 'admin' })
    const category = await createTestCategory(admin.token)
    const product = await createTestProduct(admin.token, {
      categoryId: category.category.id,
    })

    const reponse = await request(app)
      .patch(`/api/v1/products/${product.product.id}`)
      .set('Authorization', `Bearer ${admin.token}`)
      .send({ stock: -100 })

    expect(reponse.status).toBe(400)
  })

  it('should reject invalid id parameter', async () => {
    const admin = await createTestUser({ role: 'admin' })

    const response = await request(app)
      .patch(`/api/v1/products/invalid-id-parameter`)
      .set('Authorization', `Bearer ${admin.token}`)
      .send({
        name: 'updatedName',
        slug: 'updatedSlug',
        description: 'updatedDescription',
        price: 250.99,
        stock: 100,
        updatedAt: new Date(),
      })

    expect(response.status).toBe(400)
  })

  it('should return 404 when product does not exist', async () => {
    const admin = await createTestUser({ role: 'admin' })

    const response = await request(app)
      .patch(`/api/v1/products/123e4567-e89b-12d3-a456-426614174000`)
      .set('Authorization', `Bearer ${admin.token}`)
      .send({
        name: 'updatedName',
        slug: 'updatedSlug',
        description: 'updatedDescription',
        price: 250.99,
        stock: 100,
        updatedAt: new Date(),
      })

    expect(response.status).toBe(404)
  })
})
