// import type { orders } from "../../db/schema/orders.ts";

import type { orderStatusEnum } from '../../db/schema/orders.ts'

// export type OrderInput = typeof orders.$inferInsert

export type OrderStatusInput = (typeof orderStatusEnum.enumValues)[number]
