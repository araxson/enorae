import { createClient } from '@/lib/supabase/client'

export async function getBookingRules(serviceId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('service_booking_rules')
    .select('*')
    .eq('service_id', serviceId)

  if (error) throw error
  return data
}