import type { Database } from '@/lib/types/database.types'

export type OperatingHours = Database['public']['Views']['operating_hours_view']['Row']

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
