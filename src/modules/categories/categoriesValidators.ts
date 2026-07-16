import { z } from 'zod'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { categories } from '../../db/schema/categories.ts'

export const categoryInsertSchema = createInsertSchema(categories)
