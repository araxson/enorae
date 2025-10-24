import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'
import { getUserSalon } from '@/features/business/business-common/api/queries'

type SalonTable = Database['organization']['Tables']['salons']['Row']

export async function getSalonBusinessInfo() {
  // SECURITY: Require business user role
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  // Get the user's active salon
  const salon = await getUserSalon()
  if (!salon.id) throw new Error('Salon ID not found')

  const supabase = await createClient()

  // Query from organization.salons table (not the public view) to get business_name and business_type
  const { data, error } = await supabase
    .schema('organization')
    .from('salons')
    .select('id, name, business_name, business_type, established_at')
    .eq('id', salon.id)
    .single<Pick<SalonTable, 'id' | 'name' | 'business_name' | 'business_type' | 'established_at'>>()

  if (error) throw error
  return data
}