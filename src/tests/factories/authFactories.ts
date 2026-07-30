import type { RegisterInput } from '../../../src/modules/auth/authTypes.ts'

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
