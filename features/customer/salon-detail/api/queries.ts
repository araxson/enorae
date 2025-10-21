import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

type Salon = Database['public']['Views']['salons']['Row']
type Service = Database['public']['Views']['services']['Row']
type Staff = Database['public']['Views']['staff']['Row']
type SalonReview = Database['public']['Views']['salon_reviews_view']['Row']
type SalonMedia = Database['public']['Views']['salon_media_view']['Row']

export async function getSalonBySlug(slug: string) {
  await requireAuth()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('salons')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) throw error
  return data as Salon
}

export async function getSalonMetadataBySlug(slug: string) {
  await requireAuth()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('salons')
    .select('name, description, location_address')
    .eq('slug', slug)
    .single()

  if (error) return null
  return data as { name: string | null; description: string | null; location_address: string | null } | null
}

export async function getSalonServices(salonId: string) {
  await requireAuth()
  const supabase = await createClient()

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
  await requireAuth()
  const supabase = await createClient()

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
  await requireAuth()
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
  await requireAuth()
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
  const session = await requireAuth()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('customer_favorites')
    .select('id')
    .eq('salon_id', salonId)
    .eq('customer_id', session.user.id)
    .maybeSingle()

  if (error) throw error
  return !!data
}