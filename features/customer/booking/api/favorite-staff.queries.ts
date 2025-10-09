import 'server-only'
import { createClient } from '@/lib/supabase/server'

export async function calculateCustomerFavoriteStaff(
  customerId: string,
  salonId: string
): Promise<string | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .rpc('calculate_customer_favorite_staff', {
      p_customer_id: customerId,
      p_salon_id: salonId,
    })

  if (error) throw error
  return data as string | null
}

export async function getCustomerVisitFrequency(
  customerId: string,
  salonId: string
): Promise<number | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .rpc('calculate_avg_days_between_visits', {
      p_customer_id: customerId,
      p_salon_id: salonId,
    })

  if (error) throw error
  return data as number | null
}
