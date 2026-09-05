import { defineConfig } from 'drizzle-kit'
import env from './env.ts'

export default defineConfig({
  schema: './src/db/schema/index.ts',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
})
console.log('DATABASE_URL starts with:', env.DATABASE_URL.slice(0, 13))
console.log('DATABASE_URL host:', new URL(env.DATABASE_URL).hostname)
