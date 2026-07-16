import { categoryInsertSchema } from './categoriesValidators.ts'
import { z } from 'zod'

export type categoryInput = z.infer<typeof categoryInsertSchema>
