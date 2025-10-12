import type { Database } from '@/lib/types/database.types'

export type Service = Database['public']['Views']['services']['Row']

export interface ServicesManagementClientProps {
  salon: { id: string }
  services: Service[]
}
