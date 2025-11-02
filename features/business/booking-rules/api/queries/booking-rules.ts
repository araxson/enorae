import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'
import { createOperationLogger } from '@/lib/observability'

type BookingRule = Database['public']['Views']['service_booking_rules_view']['Row']

export type BookingRuleWithService = BookingRule

export async function getBookingRules(): Promise<BookingRuleWithService[]> {
  const logger = createOperationLogger('getBookingRules', {})
  logger.start()

  // SECURITY: Require authentication
  const { supabase, salonId } = await resolveSalonContext()
  const { data, error } = await supabase
    .from('service_booking_rules_view')
    .select('*')
    .eq('salon_id', salonId)
    .is('deleted_at', null)

  if (error) throw error

  // Data from view already matches BookingRuleWithService type
  return (data ?? [])
}

export type BookingRuleServiceOption = {
  id: string
  name: string
}

export async function getBookingRuleServices(): Promise<BookingRuleServiceOption[]> {
  const { supabase, salonId } = await resolveSalonContext()

  const { data, error } = await supabase
    .from('services_view')
    .select('id, name')
    .eq('salon_id', salonId)
    .is('deleted_at', null)
    .eq('is_active', true)
    .order('name', { ascending: true })

  if (error) throw error

  const services = (data ?? []) as Array<{ id: string | null; name: string | null }>

  return services
    .filter((service): service is { id: string; name: string } => Boolean(service.id && service.name))
    .map((service) => ({
      id: service.id,
      name: service.name,
    }))
}

async function resolveSalonContext() {
  const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const supabase = await createClient()

  type StaffProfileSalonId = { salon_id: string | null }

  const { data: staffProfile, error } = await supabase
    .from('staff_profiles_view')
    .select('salon_id')
    .eq('user_id', session.user.id)
    .single<StaffProfileSalonId>()

  if (error) throw error
  if (!staffProfile?.salon_id) {
    throw new Error('User salon not found')
  }

  return { supabase, salonId: staffProfile.salon_id }
}
