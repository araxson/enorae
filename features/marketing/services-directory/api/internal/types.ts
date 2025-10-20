import type { Database } from '@/lib/types/database.types'

export type Service = Database['public']['Views']['services']['Row']
export type ServiceCategory = Database['public']['Views']['service_categories_view']['Row']
export type Salon = Database['public']['Views']['salons']['Row']
