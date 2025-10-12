import 'server-only'
import { createClient } from '@/lib/supabase/server'

export async function applyDynamicPricing(
  basePrice: number,
  serviceId: string,
  appointmentTime: string,
  salonId: string
): Promise<number> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .rpc('apply_dynamic_pricing', {
      p_base_price: basePrice,
      p_service_id: serviceId,
      p_appointment_time: appointmentTime,
      p_salon_id: salonId,
    })

  if (error) throw error
  return data as number
}

export async function calculateServicePrice(
  serviceId: string,
  customerId: string,
  bookingTime: string
): Promise<number> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .rpc('calculate_service_price', {
      p_service_id: serviceId,
      p_customer_id: customerId,
      p_booking_time: bookingTime,
    })

  if (error) throw error
  return data as number
}

export async function getPricingRules(salonId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('catalog.pricing_rules')
    .select('*')
    .eq('salon_id', salonId)
    .order('priority', { ascending: true })

  if (error) throw error
  return data
}
