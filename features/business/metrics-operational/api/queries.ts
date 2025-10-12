import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, requireUserSalonId, ROLE_GROUPS } from '@/lib/auth'
import { canAccessSalon } from '@/lib/auth/permissions/salon-access'
import type { Database } from '@/lib/types/database.types'

type OperationalMetric = Database['public']['Views']['operational_metrics']['Row']

export async function getOperationalMetrics(salonId: string): Promise<OperationalMetric | null> {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  if (!(await canAccessSalon(salonId))) {
    throw new Error('Unauthorized: Not your salon')
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('operational_metrics')
    .select('*')
    .eq('salon_id', salonId)
    .order('metric_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error('[getOperationalMetrics] Error:', error)
    return null
  }

  return data
}

export async function getOperationalSalon() {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()
  return { id: salonId }
}