import request from 'supertest'
import { describe, it, expect } from 'vitest'
import app from '../server.ts'

describe('Health endpoint', () => {
  it('should return 200', async () => {
    const response = await request(app).get('/health')

    expect(response.status).toBe(200)

    expect(response.body.status).toBe('OK')
  })
})
