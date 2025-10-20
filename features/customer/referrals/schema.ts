import { z } from 'zod'

export const referralsSchema = z.object({})
export type ReferralsSchema = z.infer<typeof referralsSchema>
