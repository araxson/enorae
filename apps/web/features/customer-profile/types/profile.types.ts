import type { Database } from '@enorae/database/types'

export type Profile = Database['public']['Views']['profiles']['Row']
export type Appointment = Database['public']['Views']['appointments']['Row']