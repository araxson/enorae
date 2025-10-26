import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

type Salon = Database['public']['Views']['salons_view']['Row']
type Service = Database['public']['Views']['services_view']['Row']
type Staff = Database['public']['Views']['staff_profiles_view']['Row']
type SalonReview = Database['public']['Views']['salon_reviews_view']['Row']
type SalonMedia = Database['public']['Views']['salon_media_view']['Row']
type SalonDescription = Pick<
  Database['public']['Views']['salon_descriptions_view']['Row'],
  'short_description' | 'full_description'
>
type SalonContact = Pick<
  Database['public']['Views']['salon_contact_details_view']['Row'],
  | 'primary_phone'
  | 'primary_email'
  | 'website_url'
  | 'instagram_url'
  | 'facebook_url'
  | 'twitter_url'
  | 'tiktok_url'
>
type SalonLocation = Pick<
  Database['organization']['Tables']['salon_locations']['Row'],
  'is_primary'
> & {
  formatted_address?: string | null
}
type SalonSettings = Pick<
  Database['public']['Views']['salon_settings_view']['Row'],
  'booking_lead_time_hours'
>

export async function getSalonBySlug(slug: string) {
  await requireAuth()
  const supabase = await createClient()

  const { data: salon, error: salonError } = await supabase
    .from('salons_view')
    .select('*')
    .eq('slug', slug)
    .single<Salon>()

  if (salonError) throw salonError
  if (!salon) throw new Error('Salon not found')

  const salonId = salon.id
  if (!salonId) {
    throw new Error('Salon identifier missing')
  }

  const [
    descriptionResponse,
    contactResponse,
    settingsResponse,
    locationResponse,
    servicesResponse,
  ] = await Promise.all([
    supabase
      .from('salon_descriptions_view')
      .select('short_description, full_description')
      .eq('salon_id', salonId)
      .maybeSingle<SalonDescription>(),
    supabase
      .from('salon_contact_details_view')
      .select(
        'primary_phone, primary_email, website_url, instagram_url, facebook_url, twitter_url, tiktok_url'
      )
      .eq('salon_id', salonId)
      .maybeSingle<SalonContact>(),
    supabase
      .from('salon_settings_view')
      .select('booking_lead_time_hours')
      .eq('salon_id', salonId)
      .maybeSingle<SalonSettings>(),
    supabase
      .from('salon_locations_view')
      .select('is_primary, formatted_address')
      .eq('salon_id', salonId)
      .eq('is_primary', true)
      .maybeSingle<SalonLocation>(),
    supabase
      .from('services_view')
      .select('id', { count: 'exact', head: true })
      .eq('salon_id', salonId)
      .eq('is_active', true),
  ])

  const { data: description, error: descriptionError } = descriptionResponse
  if (descriptionError) throw descriptionError
  const { data: contact, error: contactError } = contactResponse
  if (contactError) throw contactError
  const { data: settings, error: settingsError } = settingsResponse
  if (settingsError) throw settingsError
  const { data: location, error: locationError } = locationResponse
  if (locationError) throw locationError
  const { count: servicesCount, error: servicesError } = servicesResponse
  if (servicesError) throw servicesError

  return {
    ...salon,
    rating: salon.rating_average ?? null,
    review_count: salon.rating_count ?? null,
    staff_count: (salon as Salon & { employee_count?: number | null }).employee_count ?? null,
    services_count: servicesCount ?? 0,
    booking_lead_time_hours:
      settings?.booking_lead_time_hours ?? (salon as Salon & { booking_lead_time_hours?: number | null }).booking_lead_time_hours ??
      null,
    short_description: description?.short_description ?? null,
    description: description?.full_description ?? null,
    phone: contact?.primary_phone ?? null,
    email: contact?.primary_email ?? null,
    website_url: contact?.website_url ?? null,
    instagram_url: contact?.instagram_url ?? null,
    facebook_url: contact?.facebook_url ?? null,
    twitter_url: contact?.twitter_url ?? null,
    tiktok_url: contact?.tiktok_url ?? null,
    full_address: location?.formatted_address ?? null,
    amenities: [],
    specialties: [],
  }
}

export async function getSalonMetadataBySlug(slug: string) {
  await requireAuth()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('salons_view')
    .select('name, full_description, formatted_address')
    .eq('slug', slug)
    .single()

  if (error) return null
  return data as { name: string | null; full_description: string | null; formatted_address: string | null } | null
}

export async function getSalonServices(salonId: string) {
  await requireAuth()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('services_view')
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
    .from('staff_profiles_view')
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
    .from('customer_favorites_view')
    .select('id')
    .eq('salon_id', salonId)
    .eq('customer_id', session.user['id'])
    .maybeSingle()

  if (error) throw error
  return !!data
}
