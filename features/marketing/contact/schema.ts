import { z } from 'zod'

export const contactSchema = z.object({})
export type ContactSchema = z.infer<typeof contactSchema>
