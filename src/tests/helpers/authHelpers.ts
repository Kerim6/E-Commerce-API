import request from 'supertest'
import app from '../../../src/server.ts'
import { buildUser } from '../factories/authFactories.ts'

type UserRole = 'user' | 'admin'

type CreateUserOptions = {
  role?: UserRole
  firstName?: string
  lastName?: string
  email?: string
  password?: string
}

export const createTestUser = async (options: CreateUserOptions = {}) => {
  const input = buildUser(options)

  const response = await request(app).post('/api/v1/auth/register').send(input)

  return {
    input,
    response,
    user: response.body.user,
    token: response.body.token,
  }
}

export const loginTestUser = async (email: string, password: string) => {
  const response = await request(app).post('/api/v1/auth/login').send({
    email,
    password,
  })

  return {
    response,
    user: response.body.user,
    token: response.body.token,
  }
}
