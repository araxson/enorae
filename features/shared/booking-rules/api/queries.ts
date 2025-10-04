import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

type BookingRule = Database['public']['Views']['service_booking_rules']['Row']

export type BookingRuleWithService = BookingRule & {
  service: {
    id: string
    name: string
    salon_id: string
  } | null
}

export async function getBookingRules(): Promise<BookingRuleWithService[]> {
  // SECURITY: Require authentication
  const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()

  const { data: staffProfile } = await supabase
    .from('staff')
    .select('salon_id')
    .eq('user_id', session.user.id)
    .single<{ salon_id: string | null }>()

  if (!staffProfile?.salon_id) throw new Error('User salon not found')

  const { data, error } = await supabase
    .from('service_booking_rules')
    .select(`
      *,
      service:services!fk_service_booking_rules_service(id, name, salon_id)
    `)
    .eq('services.salon_id', staffProfile.salon_id)
    .is('deleted_at', null)

  if (error) throw error
  return data as BookingRuleWithService[]
}
