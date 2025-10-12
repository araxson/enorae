import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { canAccessSalon, getUserSalonIds } from '@/lib/auth/permissions'

export async function resolveAccessibleSalonIds(
  requestedSalonId?: string,
): Promise<string[]> {
  const accessibleSalonIds = await getUserSalonIds()
  if (!accessibleSalonIds.length) {
    return []
  }

  if (!requestedSalonId) {
    return accessibleSalonIds
  }

  const authorized = await canAccessSalon(requestedSalonId)
  if (!authorized) {
    throw new Error('Unauthorized')
  }

  return [requestedSalonId]
}

export async function requireBusinessRole() {
  return requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
}

export async function createInventoryClient() {
  return createClient()
}
