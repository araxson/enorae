import { z } from 'zod'

export const privacySchema = z.object({})
export type PrivacySchema = z.infer<typeof privacySchema>
