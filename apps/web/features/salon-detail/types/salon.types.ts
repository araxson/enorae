import type { Database } from '@enorae/database/types'

export type Salon = Database['public']['Views']['salons']['Row']
export type Service = Database['public']['Views']['services']['Row']
export type Staff = Database['public']['Views']['staff']['Row']

export interface SalonDetailData {
  salon: Salon
  services: Service[]
  staff: Staff[]
}