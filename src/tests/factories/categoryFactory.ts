import request from 'supertest'
import app from '../../../src/server.ts'

export const createTestCategory = async (token: string) => {
  const random = crypto.randomUUID()

  const input = {
    name: `Test Category: ${random}`,
    slug: `test-category-${random}`,
  }

  const response = await request(app)
    .post('/api/v1/categories')
    .set('Authorization', `Bearer ${token}`)
    .send(input)

  return {
    input,
    response,
    category: response.body,
  }
}
