import { z } from 'zod'

export const howItWorksSchema = z.object({})
export type HowItWorksSchema = z.infer<typeof howItWorksSchema>
