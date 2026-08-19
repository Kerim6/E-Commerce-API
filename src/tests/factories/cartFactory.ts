import request from 'supertest'
import app from '../../server.ts'
import { createTestCategory } from './categoryFactory.ts'
import { createTestProduct } from './productFactory.ts'
import { createTestUser } from '../helpers/authHelpers.ts'

type AddToCartOptions = {
  quantity?: number
  stock?: number
}

export const createTestCartItem = async (
  token: string,
  options: AddToCartOptions = {},
) => {
  const admin = await createTestUser({ role: 'admin' })

  const category = await createTestCategory(admin.token)

  const product = await createTestProduct(admin.token, {
    categoryId: category.category.id,
    stock: options.stock ?? 10,
  })

  const input = {
    productId: product.product.id,
    quantity: options.quantity ?? 1,
  }

  const response = await request(app)
    .post('/api/v1/items')
    .set('Authorization', `Bearer ${token}`)
    .send(input)

  return {
    input,
    response,
    product,
    category,
  }
}
