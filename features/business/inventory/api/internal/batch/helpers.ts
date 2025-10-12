import 'server-only'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, requireUserSalonId, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export const productIdArraySchema = z.array(z.string().regex(UUID_REGEX))

export async function getInventoryContext() {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()
  const supabase = await createClient()
  return { supabase, salonId }
}

export function assertNonEmpty<T>(values: T[], message: string) {
  if (values.length === 0) {
    throw new Error(message)
  }
}

export function ensureSalonOwnership<T extends { salon_id: string | null }>(
  rows: T[],
  expectedSalonId: string,
) {
  if (rows.length === 0) {
    throw new Error('No records found')
  }

  const mismatched = rows.some((row) => row.salon_id !== expectedSalonId)
  if (mismatched) {
    throw new Error('Some items do not belong to your salon')
  }
}

export function revalidateInventory() {
  revalidatePath('/business/inventory')
}

export type DatabaseClient = Awaited<ReturnType<typeof createClient>>
export type SupabaseClient = DatabaseClient
export type InventoryDatabase = Database
export { UUID_REGEX }
