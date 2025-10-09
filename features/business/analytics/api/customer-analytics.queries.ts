import 'server-only'
import { createClient } from '@/lib/supabase/server'

interface CustomerMetrics {
  total_visits: number
  total_spent: number
  lifetime_value: number
  avg_ticket: number
  last_visit_date: string | null
  first_visit_date: string | null
  favorite_service_id: string | null
  cancellation_rate: number
  no_show_rate: number
}

export async function calculateCustomerMetrics(
  customerId: string,
  salonId: string
): Promise<CustomerMetrics | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Call the stored procedure to calculate and store metrics
  const { error: calcError } = await supabase
    .rpc('calculate_customer_metrics', {
      p_customer_id: customerId,
      p_salon_id: salonId,
    })

  if (calcError) throw calcError

  // Now fetch the calculated metrics
  const { data, error } = await supabase
    .from('analytics.customer_metrics')
    .select('*')
    .eq('customer_id', customerId)
    .eq('salon_id', salonId)
    .single()

  if (error) throw error
  return data as CustomerMetrics
}

export async function getCustomerRates(
  customerId: string,
  salonId: string
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .rpc('calculate_customer_rates', {
      p_customer_id: customerId,
      p_salon_id: salonId,
    })
    .single()

  if (error) throw error
  return data
}

export async function getCustomerVisitStats(
  customerId: string,
  salonId: string
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .rpc('calculate_customer_visit_stats', {
      p_customer_id: customerId,
      p_salon_id: salonId,
    })
    .single()

  if (error) throw error
  return data
}

export async function getCustomerServiceStats(
  customerId: string,
  salonId: string
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .rpc('calculate_customer_service_stats', {
      p_customer_id: customerId,
      p_salon_id: salonId,
    })
    .single()

  if (error) throw error
  return data
}

export async function getCustomerReviewStats(
  customerId: string,
  salonId: string
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .rpc('calculate_customer_review_stats', {
      p_customer_id: customerId,
      p_salon_id: salonId,
    })
    .single()

  if (error) throw error
  return data
}
