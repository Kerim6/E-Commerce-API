import type { RegisterInput } from '../../../src/modules/auth/authTypes.ts'
import db from '../../db/connection.ts'
import { users } from '../../db/schema/users.ts'
import { eq } from 'drizzle-orm'

type UserRole = 'user' | 'admin'

type BuildUserOptions = Partial<RegisterInput> & {
  role?: UserRole
}

export const buildUser = (
  options: BuildUserOptions = {},
): RegisterInput & { role?: UserRole } => {
  return {
    firstName: options.firstName ?? 'Abdulrahman',
    lastName: options.lastName ?? 'Krayem',
    email: options.email ?? `${crypto.randomUUID()}@example.com`,
    password: options.password ?? 'password123',
    role: options.role ?? 'user',
  }
}

export const promoteUserToAdmin = async (userId: string) => {
  const [admin] = await db
    .update(users)
    .set({ role: 'admin' })
    .where(eq(users.id, userId))
    .returning()
  return admin
}
