import app from '../../server.ts'
import request from 'supertest'
import { createTestCartItem } from '../factories/cartFactory.ts'

export const createTestOrder = async (token: string) => {
  await createTestCartItem(token)
  await createTestCartItem(token)

  const response = await request(app)
    .post('/api/v1/orders')
    .set('Authorization', `Bearer ${token}`)

  return {
    response,
  }
}
