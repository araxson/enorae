'use server'

import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, requireUserSalonId, ROLE_GROUPS } from '@/lib/auth'

export async function getBusinessSession() {
  const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  if (!session.user) {
    throw new Error('Unauthorized')
  }
  return session
}

export async function getSupabaseClient() {
  return createClient()
}

export async function getSalonId() {
  return requireUserSalonId()
}
