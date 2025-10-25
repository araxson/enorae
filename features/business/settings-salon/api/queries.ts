import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { getUserSalon } from '@/features/business/business-common/api/queries'
import type { Database } from '@/lib/types/database.types'

type SalonView = Database['public']['Views']['salons_view']['Row']

export async function getSalonBusinessInfo() {
  // SECURITY: Require business user role
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  // Get the user's active salon
  const salon = await getUserSalon()
  if (!salon.id) throw new Error('Salon ID not found')

  const supabase = await createClient()

  // Query from public salons_view to respect RLS and view contract
  const { data, error } = await supabase
    .from('salons_view')
    .select('id, name, business_name, business_type, established_at')
    .eq('id', salon.id)
    .returns<Pick<SalonView, 'id' | 'name' | 'business_name' | 'business_type' | 'established_at'>[]>()
    .single()

  if (error) throw error
  return data
}
