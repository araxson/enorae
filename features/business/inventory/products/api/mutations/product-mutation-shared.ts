import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, canAccessSalon, ROLE_GROUPS } from '@/lib/auth'
import type { Session } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'
import { UUID_REGEX } from './helpers'

export type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>
export type SupabaseCatalogClient = Pick<SupabaseServerClient, 'schema'>

const INVENTORY_SCHEMA = 'inventory'
const INVENTORY_PATH = '/business/inventory'

export async function resolveSupabase(options: { supabase?: SupabaseCatalogClient } = {}) {
  return (options.supabase ?? (await createClient())) as SupabaseCatalogClient
}

export async function resolveSession(options: { session?: Session } = {}) {
  const session = options.session ?? (await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS))
  if (!session.user) throw new Error('Unauthorized')
  return session
}

export async function ensureSalonAccess(salonId: string, skipAccessCheck?: boolean) {
  if (!UUID_REGEX.test(salonId)) {
    throw new Error('Invalid salon ID format')
  }
  if (skipAccessCheck) return true
  const canAccess = await canAccessSalon(salonId)
  if (!canAccess) {
    throw new Error('Unauthorized: Not your salon')
  }
  return true
}

export function sanitizePayload<T extends Record<string, unknown>>(payload: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined)
  ) as Partial<T>
}

export async function revalidateInventory(path = INVENTORY_PATH) {
  await revalidatePath(path)
}

export type ProductRow = Database['inventory']['Tables']['products']['Row']
