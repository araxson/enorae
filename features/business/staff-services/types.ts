import type { Database } from '@/lib/types/database.types'

export interface StaffServicesState {}

export interface StaffServicesParams {}

export type Salon = Database['public']['Views']['salons']['Row']
export type Staff = Database['public']['Views']['staff_profiles_view']['Row']
export type Service = Database['public']['Views']['services']['Row']
