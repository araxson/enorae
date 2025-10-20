import { z } from 'zod'

export const commissionSchema = z.object({})
export type CommissionSchema = z.infer<typeof commissionSchema>
