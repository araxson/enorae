import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

type Review = Database['public']['Views']['salon_reviews_view']['Row']

export async function getCustomerReviews(): Promise<Review[]> {
  const session = await requireAuth()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('salon_reviews_view')
    .select('*')
    .eq('customer_id', session.user.id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function getReviewById(id: string): Promise<Review | null> {
  const session = await requireAuth()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('salon_reviews_view')
    .select('*')
    .eq('id', id)
    .eq('customer_id', session.user.id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }

  return data
}