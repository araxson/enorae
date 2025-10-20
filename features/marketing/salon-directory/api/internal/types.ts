import type { Database } from '@/lib/types/database.types'

export type Salon = Database['public']['Views']['salons']['Row']
export type Service = Database['public']['Views']['services']['Row']

export interface SalonSearchParams {
  searchTerm?: string
  city?: string
  state?: string
  isVerified?: boolean
  limit?: number
}
