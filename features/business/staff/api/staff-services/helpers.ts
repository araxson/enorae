'use server'

import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

import { UUID_REGEX } from './constants'

export type Salon = Database['public']['Views']['salons']['Row']
export type Staff = Database['public']['Views']['staff']['Row']
export type Service = Database['public']['Views']['services']['Row']

export async function getAuthorizedContext(staffId: string) {
  const supabase = await createClient()
  const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const { data: salon } = await supabase
    .from('salons')
    .select('*')
    .eq('owner_id', session.user.id)
    .single()

  if (!salon) {
    return { error: 'Salon not found' as const }
  }

  const typedSalon = salon as Salon
  if (!typedSalon.id) {
    return { error: 'Invalid salon' as const }
  }

  const { data: staff } = await supabase
    .from('staff')
    .select('*')
    .eq('id', staffId)
    .single()

  if (!staff || (staff as Staff).salon_id !== typedSalon.id) {
    return { error: 'Unauthorized' as const }
  }

  return { supabase, session, salon: typedSalon, staff: staff as Staff }
}

export async function parseUuid(value: FormDataEntryValue | null | undefined) {
  const stringValue = value?.toString()
  if (!stringValue || !UUID_REGEX.test(stringValue)) {
    return { error: 'Invalid identifier' as const }
  }
  return { value: stringValue }
}
