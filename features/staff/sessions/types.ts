import type { Database } from '@/lib/types/database.types'

export type Session = Database['identity']['Tables']['sessions']['Row']

export type StaffSessionDetail = Session & {
  device_type?: string | null
  device_name?: string | null
  browser_name?: string | null
  browser_version?: string | null
  ip_address?: string | null
  location?: string | null
  last_active_at?: string | null
}
