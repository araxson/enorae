import { z } from 'zod'

export const transactionsSchema = z.object({})
export type TransactionsSchema = z.infer<typeof transactionsSchema>
