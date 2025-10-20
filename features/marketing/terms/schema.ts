import { z } from 'zod'

export const termsSchema = z.object({})
export type TermsSchema = z.infer<typeof termsSchema>
