import type { Database } from '@/lib/types/database.types'
import type { StaffWithServices } from './queries/staff'

export type StaffMemberWithServices = StaffWithServices
export type ServiceRow = Database['public']['Views']['services_view']['Row']

export interface StaffState {}

export interface StaffParams {}
