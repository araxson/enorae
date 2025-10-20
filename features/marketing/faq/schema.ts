import { z } from 'zod'

export const faqSchema = z.object({})
export type FaqSchema = z.infer<typeof faqSchema>
