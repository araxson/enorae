import { z } from 'zod'

export const customerCommonSchema = z.object({})
export type CustomerCommonSchema = z.infer<typeof customerCommonSchema>
