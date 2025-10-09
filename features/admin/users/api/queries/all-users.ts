import 'server-only'

import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'

import type { AdminUser, UserFilters } from './types'
import type { Database } from '@/lib/types/database.types'

export async function getAllUsers(filters?: UserFilters): Promise<AdminUser[]> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = createServiceRoleClient()

  let query = supabase
    .from('admin_users_overview')
    .select('*')
    .order('created_at', { ascending: false })

  if (filters?.search) {
    query = query.or(`full_name.ilike.%${filters.search}%,username.ilike.%${filters.search}%`)
  }

  if (filters?.is_deleted !== undefined) {
    query = filters.is_deleted
      ? query.not('deleted_at', 'is', null)
      : query.is('deleted_at', null)
  } else {
    query = query.is('deleted_at', null)
  }

  const { data, error } = await query

  if (error) {
    console.error('admin_users_overview error in getAllUsers:', error)
    const { data: fallbackData, error: fallbackError } = await supabase
      .from('profiles')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    if (fallbackError) {
      console.error('profiles fallback error:', fallbackError)
      return []
    }

    return (fallbackData || []) as unknown as AdminUser[]
  }

  return data || []
}

export async function searchUsers(searchTerm: string): Promise<AdminUser[]> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = createServiceRoleClient()

  const { data, error } = await supabase
    .from('admin_users_overview')
    .select('*')
    .or(`full_name.ilike.%${searchTerm}%,username.ilike.%${searchTerm}%`)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    console.error('admin_users_overview error in searchUsers:', error)
    return []
  }

  return data || []
}

export async function getUsersByRole(
  role: Database['public']['Enums']['role_type'],
): Promise<AdminUser[]> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = createServiceRoleClient()

  const { data, error } = await supabase
    .from('admin_users_overview')
    .select('*')
    .contains('roles', [role])
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('admin_users_overview error in getUsersByRole:', error)
    return []
  }

  return data || []
}

export async function getUsersWithDetails(): Promise<AdminUser[]> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = createServiceRoleClient()

  const { data, error } = await supabase
    .from('admin_users_overview')
    .select('*')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('admin_users_overview error in getUsersWithDetails:', error)
    return []
  }

  return data || []
}
