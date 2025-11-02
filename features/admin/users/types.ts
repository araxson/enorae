import 'server-only'
import type { Database } from '@/lib/types/database.types'

export type AdminUser = Database['public']['Views']['admin_users_overview_view']['Row']
export type Profile = Database['public']['Views']['profiles_view']['Row']
export type UserRole = Database['public']['Views']['user_roles_view']['Row']

export interface UserFilters {
  role?: string
  search?: string
  salon_id?: string
  is_deleted?: boolean
}
