import { createTestUser } from './helpers/authHelpers.ts'
import { createTestCategory } from './factories/categoryFactory.ts'

describe('POST /api/v1/categories', () => {
  it('should allow an admin to create a category', async () => {
    const admin = await createTestUser({ role: 'admin' })
    const newCategory = await createTestCategory(admin.token)

    expect(newCategory.response.status).toBe(201)
    expect(newCategory.category.name).toBe(newCategory.category.name)
    expect(newCategory.category.slug).toBe(newCategory.category.slug)
    expect(newCategory.category).toHaveProperty('id')
    expect(newCategory.category).toHaveProperty('createdAt')
  })
})
