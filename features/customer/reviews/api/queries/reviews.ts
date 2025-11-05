import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'
import { createOperationLogger } from '@/lib/observability'

type Review = Database['public']['Views']['salon_reviews_view']['Row']

export async function getCustomerReviews(): Promise<Review[]> {
  const logger = createOperationLogger('getCustomerReviews', {})
  logger.start()

  // Parallel execution: fetch session and supabase client simultaneously
  const [session, supabase] = await Promise.all([
    requireAuth(),
    createClient()
  ])

  const { data, error } = await supabase
    .from('salon_reviews_view')
    .select('id, salon_id, salon_name, customer_id, customer_name, rating, comment, helpful_count, is_flagged, is_verified, created_at')
    .eq('customer_id', session.user.id)
    .order('created_at', { ascending: false })
    .returns<Review[]>()

  if (error) throw error
  return data || []
}

export async function getReviewById(id: string): Promise<Review | null> {
  // Parallel execution: fetch session and supabase client simultaneously
  const [session, supabase] = await Promise.all([
    requireAuth(),
    createClient()
  ])

  const { data, error } = await supabase
    .from('salon_reviews_view')
    .select('id, salon_id, salon_name, customer_id, customer_name, staff_id, staff_name, rating, comment, helpful_count, is_flagged, is_verified, created_at, updated_at')
    .eq('id', id)
    .eq('customer_id', session.user.id)
    .single<Review>()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }

  return data
}