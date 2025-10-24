import type { Database } from '@/lib/types/database.types'

/**
 * Staff profile types
 */

export type StaffView = Database['public']['Views']['staff_profiles_view']['Row']

export interface ProfileState {}

export interface ProfileParams {}
