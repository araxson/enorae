import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type ServiceViewRow = Database['public']['Views']['services_view']['Row']

interface ServiceSearchResult {
  id: string
  name: string
  description: string
  slug?: string
  category_name?: string
  price?: number
  duration_minutes?: number
  rank?: number
  similarity?: number
}

export async function searchServicesFulltext(
  salonId: string,
  searchQuery: string
): Promise<ServiceSearchResult[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Search services using ILIKE pattern matching from public view
  const { data, error } = await supabase
    .from('services_view')
    .select('id, name, description, slug, category_name, price, duration_minutes')
    .eq('salon_id', salonId)
    .eq('is_active', true)
    .is('deleted_at', null)
    .or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
    .order('name')
    .returns<ServiceViewRow[]>()

  if (error) throw error

  return (data ?? []).map((service) => ({
    id: service['id']!,
    name: service['name']!,
    description: service['description'] ?? '',
    slug: service['slug'] ?? undefined,
    category_name: service['category_name'] ?? undefined,
    price: service['price'] ? Number(service['price']) : undefined,
    duration_minutes: service['duration_minutes'] ?? undefined,
  }))
}

export async function searchServicesOptimized(
  salonId: string,
  searchQuery: string
): Promise<ServiceSearchResult[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Optimized search using text similarity from public view
  const { data, error } = await supabase
    .from('services_view')
    .select('id, name, description, slug, category_name, price, duration_minutes')
    .eq('salon_id', salonId)
    .eq('is_active', true)
    .is('deleted_at', null)
    .or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
    .order('name')
    .limit(20)
    .returns<ServiceViewRow[]>()

  if (error) throw error

  return (data ?? []).map((service) => ({
    id: service['id']!,
    name: service['name']!,
    description: service['description'] ?? '',
    slug: service['slug'] ?? undefined,
    category_name: service['category_name'] ?? undefined,
    price: service['price'] ? Number(service['price']) : undefined,
    duration_minutes: service['duration_minutes'] ?? undefined,
  }))
}

export async function getServices(salonId: string): Promise<ServiceViewRow[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('services_view')
    .select('*')
    .eq('salon_id', salonId)
    .eq('is_active', true)
    .is('deleted_at', null)
    .order('name')
    .returns<ServiceViewRow[]>()

  if (error) throw error

  return data ?? []
}

export async function getUserSalon(): Promise<{ id: string } | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Get user's salon from staff_profiles_view
  const { data, error } = await supabase
    .from('staff_profiles_view')
    .select('salon_id')
    .eq('user_id', user.id)
    .maybeSingle<{ salon_id: string | null }>()

  if (error) throw error

  // Explicitly handle the salon_id which can be null
  if (data?.salon_id) {
    return { id: data.salon_id }
  }

  return null
}
