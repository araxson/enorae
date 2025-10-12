import type { Database } from '@/lib/types/database.types'

export type Salon = Database['public']['Views']['salons']['Row']
export type Service = Database['public']['Views']['services']['Row']

export type ServicesByCategory = Record<string, Service[]>

export interface SalonProfileViewProps {
  salon: Salon
  services?: Service[]
}
