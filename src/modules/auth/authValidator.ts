import { z } from 'zod'

export const registerUserSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  firstName: z.string().max(50),
  lastName: z.string().max(50),
})

export const loginUserSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
})
