import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'
import type { PostgrestError } from '@supabase/supabase-js'

type Salon = Database['public']['Views']['salons_view']['Row']
type Service = Database['public']['Views']['services_view']['Row']
type Staff = Database['public']['Views']['staff_profiles_view']['Row']
type SalonReview = Database['public']['Views']['salon_reviews_view']['Row']
type SalonMedia = Database['public']['Views']['salon_media_view']['Row']

export async function getSalonBySlug(slug: string) {
  await requireAuth()
  const supabase = await createClient()

  // Get basic salon data
  const { data: salon, error: salonError } = await supabase
    .from('salons_view')
    .select('*')
    .eq('slug', slug)
    .single() as { data: Salon | null; error: PostgrestError | null }

  if (salonError) throw salonError
  if (!salon) throw new Error('Salon not found')

  // Get all related data in parallel
  type DescriptionRow = { short_description: string | null; full_description: string | null }
  type ContactRow = {
    primary_phone: string | null
    primary_email: string | null
    website_url: string | null
    instagram_url: string | null
    facebook_url: string | null
    twitter_url: string | null
    tiktok_url: string | null
  }
  type LocationRow = {
    is_primary: boolean | null
    formatted_address: string | null
  }
  type SettingsRow = {
    booking_lead_time_hours: number | null
  }
  type AmenityRow = { amenities: { id: string; name: string; icon: string | null } | null }
  type SpecialtyRow = { specialties: { id: string; name: string; category: string | null } | null }

  const [
    { data: description },
    { data: contact },
    { data: settings },
    { data: location },
    { data: amenitiesData },
    { data: specialtiesData },
    { count: servicesCount }
  ] = await Promise.all([
    supabase
      .from('salon_descriptions_view')
      .select('short_description, full_description')
      .eq('salon_id', salon.id!)
      .maybeSingle() as unknown as Promise<{ data: DescriptionRow | null; error: PostgrestError | null }>,
    supabase
      .from('salon_contact_details_view')
      .select('primary_phone, primary_email, website_url, instagram_url, facebook_url, twitter_url, tiktok_url')
      .eq('salon_id', salon.id!)
      .maybeSingle() as unknown as Promise<{ data: ContactRow | null; error: PostgrestError | null }>,
    supabase
      .from('salon_settings_view')
      .select('booking_lead_time_hours')
      .eq('salon_id', salon.id!)
      .maybeSingle() as unknown as Promise<{ data: SettingsRow | null; error: PostgrestError | null }>,
    supabase
      .from('salon_locations_view')
      .select('is_primary, formatted_address')
      .eq('salon_id', salon.id!)
      .eq('is_primary', true)
      .maybeSingle() as unknown as Promise<{ data: LocationRow | null; error: PostgrestError | null }>,
    supabase
      .from('salon_amenities')
      .select('amenities(id, name, icon)')
      .eq('salon_id', salon.id!) as unknown as Promise<{ data: AmenityRow[] | null; error: PostgrestError | null }>,
    supabase
      .from('salon_specialties')
      .select('specialties(id, name, category)')
      .eq('salon_id', salon.id!) as unknown as Promise<{ data: SpecialtyRow[] | null; error: PostgrestError | null }>,
    supabase
      .from('services_view')
      .select('*', { count: 'exact', head: true })
      .eq('salon_id', salon.id!)
      .eq('is_active', true)
  ])

  // Combine all data into expected format
  return {
    ...salon,
    rating: (salon as Salon & { rating_average?: number | null }).rating_average ?? null,
    review_count: (salon as Salon & { rating_count?: number | null }).rating_count ?? null,
    staff_count: (salon as Salon & { employee_count?: number | null }).employee_count ?? null,
    services_count: servicesCount ?? 0,
    booking_lead_time_hours:
      settings?.booking_lead_time_hours ??
      (salon as Salon & { booking_lead_time_hours?: number | null }).booking_lead_time_hours ??
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
    amenities: amenitiesData?.map(a => a.amenities).filter(Boolean) ?? [],
    specialties: specialtiesData?.map(s => s.specialties).filter(Boolean) ?? []
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
    .eq('customer_id', session.user.id)
    .maybeSingle()

  if (error) throw error
  return !!data
}
