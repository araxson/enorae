import { z } from 'zod'

export const staffSchema = z.object({})
export type StaffSchema = z.infer<typeof staffSchema>
