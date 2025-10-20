import { z } from 'zod'

export const financeSchema = z.object({})
export type FinanceSchema = z.infer<typeof financeSchema>
