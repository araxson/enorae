import 'server-only'
import { createClient } from '@/lib/supabase/server'
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
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Unauthorized')

  const { data: staffProfile } = await supabase
    .from('staff')
    .select('salon_id')
    .eq('user_id', user.id)
    .single()

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
