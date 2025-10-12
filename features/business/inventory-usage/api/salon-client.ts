import { requireAnyRole, requireUserSalonId, ROLE_GROUPS } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'
import type { SupabaseClient } from '@supabase/supabase-js'

export interface SalonClientContext {
  supabase: SupabaseClient<Database>
  salonId: string
}

export async function createSalonClient(): Promise<SalonClientContext> {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()
  const supabase = await createClient()
  return { supabase, salonId }
}
