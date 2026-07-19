import { productCreateSchema } from './productValidators.ts'
import { z } from 'zod'

export type ProductInput = z.infer<typeof productCreateSchema>
