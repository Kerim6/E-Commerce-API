import { z } from 'zod'

export const productCreateSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  slug: z.string().trim().min(1, 'Slug is required'),
  description: z.string().trim().optional(),
  price: z.coerce.number().nonnegative('Price must be non-negative'),
  stock: z.coerce.number().int().nonnegative('Stock must be non-negative'),
  categoryId: z.string().uuid('Category ID must be a valid UUID'),
})

export const productUpdateSchema = productCreateSchema.partial()
