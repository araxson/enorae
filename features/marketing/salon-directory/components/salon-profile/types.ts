import type { Database } from '@/lib/types/database.types'

type BaseSalon = Database['public']['Views']['salons']['Row']

export type Salon = BaseSalon & {
  services_count?: number | null
  staff_count?: number | null
  established_at?: string | null
  specialties?: string[] | null
  description?: string | null
  cover_image_url?: string | null
  logo_url?: string | null
  rating?: number | null
  review_count?: number | null
}

export type Service = Database['public']['Views']['services']['Row']

export type ServicesByCategory = Record<string, Service[]>

export interface SalonProfileViewProps {
  salon: Salon
  services?: Service[]
}
