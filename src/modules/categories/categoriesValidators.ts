import { z } from 'zod'

export const categoryInsertSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  slug: z.string().trim().min(1, 'Slug is required'),
})
