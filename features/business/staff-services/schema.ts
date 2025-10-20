import { z } from 'zod'

export const staffServicesSchema = z.object({})
export type StaffServicesSchema = z.infer<typeof staffServicesSchema>
