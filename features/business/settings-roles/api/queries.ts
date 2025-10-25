import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, getSalonContext, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

type UserRole = Database['public']['Views']['user_roles_view']['Row']

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
    .from('user_roles_view')
    .select(`
      *,
      salon:salon_id(id, name)
    `)
    .in('salon_id', accessibleSalonIds)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) throw error

  const roles = (data ?? []) as Array<(UserRole & { salon?: { id: string | null; name: string | null } | null })>

  const userIds = Array.from(
    new Set(roles.map((role) => role.user_id).filter((id): id is string => Boolean(id)))
  )

  let usersById: Record<string, { id: string; full_name: string | null; email: string | null }> = {}

  if (userIds.length > 0) {
    const { data: userRows, error: usersError } = await supabase
      .from('profiles_view')
      .select('id, full_name, email')
      .in('id', userIds)

    if (usersError) throw usersError

    usersById = Object.fromEntries(
      (userRows ?? [])
        .filter((profile): profile is NonNullable<typeof userRows[0]> => profile?.id !== null && profile?.id !== undefined)
        .map((profile) => [
          profile.id,
          {
            id: profile.id,
            full_name: profile.full_name ?? null,
            email: profile.email ?? null,
          },
        ])
    )
  }

  return roles.map((role) => ({
    ...role,
    user: role.user_id ? usersById[role.user_id] ?? null : null,
    salon: role.salon ?? null,
  }))
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
    .from('staff_profiles_view')
    .select('id, user_id')
    .in('salon_id', accessibleSalonIds)

  if (error) throw error

  const staffProfiles = (data ?? []) as Array<{ id: string | null; user_id: string | null }>
  const profileIds = Array.from(
    new Set(staffProfiles.map((profile) => profile.user_id).filter((id): id is string => Boolean(id)))
  )

  if (profileIds.length === 0) {
    return []
  }

  const { data: profileRows, error: profilesError } = await supabase
    .from('profiles_view')
    .select('id, full_name, email')
    .in('id', profileIds)

  if (profilesError) throw profilesError

  const profilesById = new Map(
    (profileRows ?? [])
      .filter((profile): profile is NonNullable<typeof profileRows[0]> => profile?.id !== null && profile?.id !== undefined)
      .map((profile) => [
        profile.id,
        {
          full_name: profile.full_name ?? null,
          email: profile.email ?? null,
        },
      ])
  )

  return staffProfiles
    .map((profile) => ({
      id: profile.id as string,
      full_name: profilesById.get(profile.user_id ?? '')?.full_name ?? null,
      email: profilesById.get(profile.user_id ?? '')?.email ?? null,
    }))
    .filter((staff) => Boolean(staff.id))
    .sort((a, b) => (a.full_name ?? '').localeCompare(b.full_name ?? ''))
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
    .from('user_roles_view')
    .select(`
      *,
      salon:salon_id(id, name)
    `)
    .eq('id', id)
    .in('salon_id', accessibleSalonIds)
    .maybeSingle()

  if (error) throw error
  if (!data) return null

  let userDetails: UserRoleWithDetails['user'] = null

  if (data.user_id) {
    const { data: userRow, error: userError } = await supabase
      .from('profiles_view')
      .select('id, full_name, email')
      .eq('id', data.user_id)
      .maybeSingle()

    if (userError) throw userError
    if (userRow && userRow.id) {
      userDetails = {
        id: userRow.id,
        full_name: userRow.full_name ?? null,
        email: userRow.email ?? null,
      }
    }
  }

  return {
    ...data,
    user: userDetails,
    salon: data.salon ?? null,
  } as UserRoleWithDetails
}
