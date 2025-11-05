import 'server-only'

import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'

import type { AdminUser, Profile, UserRole } from '../../api/types'
import { createOperationLogger } from '@/lib/observability'

export async function getUserById(userId: string): Promise<AdminUser | null> {
  const logger = createOperationLogger('getUserById', {})
  logger.start()

  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = createServiceRoleClient()

  const { data, error } = await supabase
    .from('admin_users_overview_view')
    .select('id, email, full_name, primary_role, is_active, last_active, created_at, updated_at, deleted_at')
    .eq('id', userId)
    .single()

  if (error) {
    logger.error(error, 'database', { query: 'admin_users_overview_view' })
    return null
  }

  return data as unknown as AdminUser | null
}

export async function getUserProfile(userId: string): Promise<Profile | null> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = createServiceRoleClient()

  const { data, error } = await supabase
    .from('profiles_view')
    .select('id, email, full_name, avatar_url, is_active, created_at, updated_at, deleted_at')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data as unknown as Profile | null
}

export async function getUserRoles(userId: string): Promise<UserRole[]> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = createServiceRoleClient()

  const { data, error } = await supabase
    .from('user_roles_view')
    .select('id, user_id, role, is_active, created_at, updated_at')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data || []) as unknown as UserRole[]
}

export async function getUserSessions(userId: string): Promise<Array<{
  id: string | null
  user_id: string | null
  is_active: boolean | null
  created_at: string | null
  [key: string]: unknown
}>> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = createServiceRoleClient()

  const { data, error } = await supabase
    .from('sessions_view')
    .select('id, user_id, is_active, created_at, last_active_at')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data || []) as unknown as Array<{ id: string | null; user_id: string | null; is_active: boolean | null; created_at: string | null; [key: string]: unknown }>
}
