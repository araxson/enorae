import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, getSalonContext, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

type UserRole = Database['public']['Views']['user_roles']['Row']

export type UserRoleWithDetails = UserRole & {
  user?: {
    id: string
    full_name: string | null
    email: string | null
  } | null
  salon?: {
    id: string
    name: string | null
  } | null
}

/**
 * Get user roles for the business user's salon(s)
 */
export async function getUserRoles(): Promise<UserRoleWithDetails[]> {
  // SECURITY: Require business role
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const { accessibleSalonIds } = await getSalonContext()
  if (!accessibleSalonIds.length) throw new Error('User salon not found')

  const supabase = await createClient()

  // PERFORMANCE: Use join syntax to eliminate N+1 queries
  const { data, error } = await supabase
    .from('user_roles')
    .select(`
      *,
      user:user_id(id, full_name, email),
      salon:salon_id(id, name)
    `)
    .in('salon_id', accessibleSalonIds)
    .eq('is_active', true)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) throw error

  // Filter out any error objects and type assert
  const roles = data || []
  return roles.filter((item: unknown): item is UserRoleWithDetails =>
    item !== null && typeof item === 'object' && !('error' in item)
  )
}

/**
 * Get available staff members for role assignment
 */
export async function getAvailableStaff(): Promise<Array<{
  id: string
  full_name: string | null
  email: string | null
}>> {
  // SECURITY: Require business role
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const { accessibleSalonIds } = await getSalonContext()
  if (!accessibleSalonIds.length) throw new Error('User salon not found')

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('staff')
    .select('id, full_name, email')
    .in('salon_id', accessibleSalonIds)
    .order('full_name', { ascending: true })

  if (error) throw error

  return data || []
}

/**
 * Get user role by ID
 */
export async function getUserRoleById(id: string): Promise<UserRoleWithDetails | null> {
  // SECURITY: Require business role
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const { accessibleSalonIds } = await getSalonContext()
  if (!accessibleSalonIds.length) throw new Error('User salon not found')

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('user_roles')
    .select(`
      *,
      user:user_id(id, full_name, email),
      salon:salon_id(id, name)
    `)
    .eq('id', id)
    .in('salon_id', accessibleSalonIds)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }

  return data as unknown as UserRoleWithDetails
}