import { z } from 'zod'

export const staffProfilesSchema = z.object({})
export type StaffProfilesSchema = z.infer<typeof staffProfilesSchema>
