import { z } from 'zod'

export const chainsSchema = z.object({})
export type ChainsSchema = z.infer<typeof chainsSchema>
