import { z } from 'zod'
import { orderStatusEnum, orders } from '../../db/schema/orders.ts'

export const uuidSchema = z.object({
  id: z.uuid(),
})

export const orderStatusSchema = z.object({
  status: z.enum([
    'pending',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
  ]),
})
