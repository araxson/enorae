import type { Database } from '@/lib/types/database.types'

type BaseSalon = Database['public']['Views']['salons_view']['Row']

export type Salon = BaseSalon & {
  services_count?: number | null
  staff_count?: number | null
  established_at?: string | null
}

export type Service = Database['public']['Views']['services_view']['Row']

export type ServicesByCategory = Record<string, Service[]>

export interface SalonProfileViewProps {
  salon: Salon
  services?: Service[]
}
