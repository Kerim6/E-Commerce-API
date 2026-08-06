import request from 'supertest'
import app from '../../server.ts'

type CreateProductOptions = {
  name?: string
  slug?: string
  description?: string
  price?: number
  stock?: number
  categoryId?: string
}

export const createTestProduct = async (
  token: string,
  options: CreateProductOptions = {},
) => {
  const random = crypto.randomUUID()

  const input = {
    name: options.name ?? random,
    slug: options.slug ?? random,
    description: options.description ?? random,
    price: options.price ?? 99.99,
    stock: options.stock ?? 10,
    categoryId: options.categoryId,
  }

  const response = await request(app)
    .post('/api/v1/products')
    .set('Authorization', `Bearer ${token}`)
    .send(input)

  return {
    input,
    response,
    product: response.body,
  }
}
