import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type Salon = Database['public']['Views']['salons']['Row']
type Service = Database['public']['Views']['services']['Row']
type Staff = Database['public']['Views']['staff']['Row']
type SalonReview = Database['public']['Views']['salon_reviews_view']['Row']
type SalonMedia = Database['public']['Views']['salon_media_view']['Row']

export async function getSalonBySlug(slug: string) {
  const supabase = await createClient()

  // Optional auth check - enriches data if user is logged in
  await supabase.auth.getUser()

  const { data, error } = await supabase
    .from('salons')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'active')
    .single()

  if (error) throw error
  return data as Salon
}

export async function getSalonMetadataBySlug(slug: string) {
  const supabase = await createClient()

  // Optional auth check - enriches data if user is logged in
  await supabase.auth.getUser()

  const { data, error } = await supabase
    .from('salons')
    .select('name, description, location_address')
    .eq('slug', slug)
    .single()

  if (error) return null
  return data as { name: string | null; description: string | null; location_address: string | null } | null
}

export async function getSalonServices(salonId: string) {
  const supabase = await createClient()

  // Optional auth check - enriches data if user is logged in
  await supabase.auth.getUser()

  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('salon_id', salonId)
    .eq('is_active', true)
    .order('name')

  if (error) throw error
  return data as Service[]
}

export async function getSalonStaff(salonId: string) {
  const supabase = await createClient()

  // Optional auth check - enriches data if user is logged in
  await supabase.auth.getUser()

  const { data, error } = await supabase
    .from('staff')
    .select('*')
    .eq('salon_id', salonId)
    .eq('status', 'active')
    .order('full_name')

  if (error) throw error
  return data as Staff[]
}

export async function getSalonReviews(salonId: string, limit: number = 10) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('salon_reviews_view')
    .select('*')
    .eq('salon_id', salonId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return (data || []) as SalonReview[]
}

export async function getSalonMedia(salonId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('salon_media_view')
    .select('*')
    .eq('salon_id', salonId)
    .single()

  // Return null if not found (no error thrown)
  if (error && error.code === 'PGRST116') return null
  if (error) throw error
  return data as SalonMedia
}

export async function checkIsFavorited(salonId: string): Promise<boolean> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data } = await supabase
    .from('customer_favorites')
    .select('id')
    .eq('salon_id', salonId)
    .eq('customer_id', user.id)
    .maybeSingle()

  return !!data
}
