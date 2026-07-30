import { describe, expect, it } from 'vitest'
import request from 'supertest'
import app from '../../src/server.ts'

import { createTestUser, loginTestUser } from './helpers/authHelpers.ts'

describe('POST /api/v1/auth/register', () => {
  it('should register a new user', async () => {
    const { response } = await createTestUser()

    expect(response.status).toBe(201)

    expect(response.body.user).toHaveProperty('id')
    expect(response.body.user.email).toContain('@example.com')

    expect(response.body).toHaveProperty('token')
  })

  it('should reject duplicate email', async () => {
    const { input } = await createTestUser()

    const response = await request(app)
      .post('/api/v1/auth/register')
      .send(input)

    expect(response.status).toBe(409)
  })

  it('should validate request body', async () => {
    const response = await request(app).post('/api/v1/auth/register').send({
      password: 'password123',
    })

    expect(response.status).toBe(400)
  })

  it('should reject invalid email', async () => {
    const response = await request(app).post('/api/v1/auth/register').send({
      email: 'invalid-email',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
    })

    expect(response.status).toBe(400)
  })
})

describe('POST /api/v1/auth/login', () => {
  it('should login successfully', async () => {
    const { input } = await createTestUser()

    const login = await loginTestUser(input.email, input.password)

    expect(login.response.status).toBe(200)

    expect(login.user.email).toBe(input.email)

    expect(login.token).toBeDefined()
  })

  it('should reject invalid password', async () => {
    const { input } = await createTestUser()

    const response = await request(app).post('/api/v1/auth/login').send({
      email: input.email,
      password: 'WrongPassword',
    })

    expect(response.status).toBe(401)
  })

  it('should reject unknown email', async () => {
    const response = await request(app).post('/api/v1/auth/login').send({
      email: 'missing@example.com',
      password: 'password123',
    })

    expect(response.status).toBe(401)
  })
})
