import 'server-only'
import { createClient } from '@/lib/supabase/server'

interface ServiceSearchResult {
  id: string
  name: string
  description: string
  slug: string
  category_name: string
  price: number
  duration_minutes: number
  rank: number
}

export async function searchServicesFulltext(
  salonId: string,
  searchQuery: string
): Promise<ServiceSearchResult[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .rpc('search_services_fulltext', {
      search_query: searchQuery,
      p_salon_id: salonId,
    })

  if (error) throw error
  return data as ServiceSearchResult[]
}

export async function searchServicesOptimized(
  salonId: string,
  searchQuery: string
): Promise<ServiceSearchResult[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .rpc('search_services_optimized', {
      search_query: searchQuery,
      p_salon_id: salonId,
    })

  if (error) throw error
  return data as ServiceSearchResult[]
}
