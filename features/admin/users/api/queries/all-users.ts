import 'server-only'

import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'

import type { AdminUser, UserFilters } from '../../api/types'
import type { Database } from '@/lib/types/database.types'
import { logQuery } from '@/lib/observability/query-logger'
import { QUERY_LIMITS } from '@/lib/config/constants'

export async function getAllUsers(filters?: UserFilters): Promise<AdminUser[]> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const logger = logQuery('getAllUsers', { filters })

  const supabase = createServiceRoleClient()

  let query = supabase
    .from('admin_users_overview_view')
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
    logger.error(error, 'database')
    return []
  }

  logger.success({ count: data?.length ?? 0 })
  return data || []
}

export async function searchUsers(searchTerm: string): Promise<AdminUser[]> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const logger = logQuery('searchUsers', { searchTerm })

  const supabase = createServiceRoleClient()

  const { data, error } = await supabase
    .from('admin_users_overview_view')
    .select('*')
    .or(`full_name.ilike.%${searchTerm}%,username.ilike.%${searchTerm}%`)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(QUERY_LIMITS.DEFAULT_LIST)

  if (error) {
    logger.error(error, 'database')
    return []
  }

  logger.success({ count: data?.length ?? 0 })
  return data || []
}

export async function getUsersByRole(
  role: Database['public']['Enums']['role_type'],
): Promise<AdminUser[]> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const logger = logQuery('getUsersByRole', { role })

  const supabase = createServiceRoleClient()

  const { data, error } = await supabase
    .from('admin_users_overview_view')
    .select('*')
    .contains('roles', [role])
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) {
    logger.error(error, 'database')
    return []
  }

  logger.success({ count: data?.length ?? 0 })
  return data || []
}

export async function getUsersWithDetails(): Promise<AdminUser[]> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const logger = logQuery('getUsersWithDetails', {})

  const supabase = createServiceRoleClient()

  const { data, error } = await supabase
    .from('admin_users_overview_view')
    .select('*')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) {
    logger.error(error, 'database')
    return []
  }

  logger.success({ count: data?.length ?? 0 })
  return data || []
}
