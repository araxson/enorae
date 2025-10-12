'use server'

import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'

export const getSupabaseClient = () => createClient()

export async function requireBusinessSession() {
  const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  if (!session.user) {
    throw new Error('Unauthorized')
  }
  return session
}
