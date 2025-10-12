import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

type BookingRule = Database['catalog']['Tables']['service_booking_rules']['Row']

export type BookingRuleWithService = BookingRule & {
  service: {
    id: string
    name: string
    salon_id: string
  } | null
}

export async function getBookingRules(): Promise<BookingRuleWithService[]> {
  // SECURITY: Require authentication
  const { supabase, salonId } = await resolveSalonContext()
  const { data, error } = await supabase
    .schema('catalog')
    .from('service_booking_rules')
    .select(`
      *,
      service:services!fk_service_booking_rules_service(id, name, salon_id)
    `)
    .eq('services.salon_id', salonId)
    .is('deleted_at', null)

  if (error) throw error
  return data as BookingRuleWithService[]
}

export type BookingRuleServiceOption = {
  id: string
  name: string
}

export async function getBookingRuleServices(): Promise<BookingRuleServiceOption[]> {
  const { supabase, salonId } = await resolveSalonContext()

  const { data, error } = await supabase
    .from('services')
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

  const { data: staffProfile, error } = await supabase
    .from('staff')
    .select('salon_id')
    .eq('user_id', session.user.id)
    .single<{ salon_id: string | null }>()

  if (error) throw error
  if (!staffProfile?.salon_id) {
    throw new Error('User salon not found')
  }

  return { supabase, salonId: staffProfile.salon_id }
}
