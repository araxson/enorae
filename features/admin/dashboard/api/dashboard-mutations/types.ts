'use server'

import type { Database } from '@/lib/types/database.types'

export type ActionResponse<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

export type AppointmentStatus = Database['public']['Enums']['appointment_status']
