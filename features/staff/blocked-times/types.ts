import type { Database } from '@/lib/types/database.types'

export type BlockedTime = Database['public']['Views']['blocked_times']['Row']

export type BlockType = 'break' | 'personal' | 'meeting' | 'other'

export type RecurrencePattern = {
  frequency: 'daily' | 'weekly' | 'monthly'
  interval: number
  days_of_week?: number[]
  end_date?: string
}
