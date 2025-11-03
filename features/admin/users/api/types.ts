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

export type UserActionResult = { success?: boolean; error?: string }

export type UserActionsMenuProps = {
  userId: string
  userName: string
  isActive: boolean
  onSuspend: (formData: FormData) => Promise<UserActionResult>
  onReactivate: (formData: FormData) => Promise<UserActionResult>
  onTerminateSessions: (formData: FormData) => Promise<UserActionResult>
  onDelete?: (formData: FormData) => Promise<UserActionResult>
  onLoadingChange?: (loading: boolean, userId: string) => void
}
