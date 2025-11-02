import 'server-only'
import { z } from 'zod'
import { requireAnyRole, getSalonContext, ROLE_GROUPS } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import type { Session } from '@/lib/auth'
import { safeJsonParseStringArray } from '@/lib/utils/safe-json'

export const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export const VALID_ROLES = [
  'super_admin',
  'platform_admin',
  'tenant_owner',
  'salon_owner',
  'salon_manager',
  'senior_staff',
  'staff',
  'junior_staff',
  'customer',
  'vip_customer',
  'guest',
] as const

export const userRoleSchema = z.object({
  user_id: z.string().regex(UUID_REGEX, 'Invalid user ID'),
  role: z.enum(VALID_ROLES),
  salon_id: z.string().regex(UUID_REGEX, 'Invalid salon ID').optional(),
  permissions: z.array(z.string()).optional(),
})

export type ActionResult = {
  success?: boolean
  error?: string
  data?: unknown
}

export async function getAuthorizedContext() {
  const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const { accessibleSalonIds } = await getSalonContext()

  if (!accessibleSalonIds.length) {
    throw new Error('User salon not found')
  }

  const supabase = await createClient()

  return { session, accessibleSalonIds, supabase }
}

export async function verifyRoleAccess(
  supabase: Awaited<ReturnType<typeof createClient>>,
  roleId: string,
  accessibleSalonIds: string[],
) {
  const { data: roleData } = await supabase
    .schema('identity')
    .from('user_roles')
    .select('salon_id')
    .eq('id', roleId)
    .single<{ salon_id: string | null }>()

  if (!roleData || (roleData.salon_id && !accessibleSalonIds.includes(roleData.salon_id))) {
    throw new Error('Role not found or unauthorized')
  }

  return roleData
}

const permissionsSchema = z.array(z.string())

export function parsePermissions(permissionsRaw: FormDataEntryValue | null): string[] | undefined {
  if (!permissionsRaw) return undefined

  const parsed = safeJsonParseStringArray(String(permissionsRaw), [])
  if (parsed.length === 0) return undefined

  const validated = permissionsSchema.safeParse(parsed)
  if (!validated.success) {
    throw new Error('Invalid permissions format')
  }
  return validated.data
}
