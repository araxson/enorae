import { z } from 'zod'

export const staffCommonSchema = z.object({})
export type StaffCommonSchema = z.infer<typeof staffCommonSchema>
