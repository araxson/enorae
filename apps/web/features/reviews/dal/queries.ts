import { createClient } from '@/lib/supabase/client'
import type { Database } from '@enorae/database/types'

export async function getReviewsBySalon(salonId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      profiles!inner(
        full_name,
        avatar_url
      )
    `)
    .eq('salon_id', salonId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getReviewsByCustomer(customerId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      salons!inner(
        name,
        slug
      )
    `)
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function canReviewSalon(salonId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  // Check if user has completed appointment at this salon
  const { data, error } = await supabase
    .from('appointments')
    .select('id')
    .eq('salon_id', salonId)
    .eq('customer_id', user.id)
    .eq('status', 'completed')
    .limit(1)
    .single()

  return !!data && !error
}

export async function getSalonRating(salonId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('salon_metrics')
    .select('average_rating, total_reviews')
    .eq('salon_id', salonId)
    .single()

  if (error) throw error
  return data
}