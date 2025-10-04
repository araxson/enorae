import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

type Salon = Database['public']['Views']['salons']['Row']

export async function getSalonBusinessInfo() {
  // SECURITY: Require business user role
  const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('salons')
    .select('id, name, business_name, business_type, established_at')
    .eq('owner_id', session.user.id)
    .single<Pick<Salon, 'id' | 'name' | 'business_name' | 'business_type' | 'established_at'>>()

  if (error) throw error
  return data
}
