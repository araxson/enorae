import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'
import type { PostgrestError } from '@supabase/supabase-js'
import { createOperationLogger } from '@/lib/observability'
import { discoveryFilterSchema } from '@/features/customer/discovery/api/schema'

type Salon = Database['public']['Views']['salons_view']['Row']
type Service = Database['public']['Views']['services_view']['Row']

// Partial salon type for discovery listing (fewer columns for performance)
type DiscoverySalon = Pick<
  Salon,
  | 'id'
  | 'name'
  | 'slug'
  | 'formatted_address'
  | 'city'
  | 'state_province'
  | 'rating_average'
  | 'rating_count'
  | 'is_active'
  | 'created_at'
  | 'short_description'
  | 'full_description'
>

export async function getSalons(categoryFilter?: string): Promise<Salon[]> {
  const logger = createOperationLogger('getSalons', {})
  logger.start()

  await requireAuth()
  const supabase = await createClient()

  const { category } = discoveryFilterSchema.parse({ category: categoryFilter })

  // Explicit column selection for optimal bandwidth usage - include description fields for search
  let query = supabase
    .from('salons_view')
    .select('id, name, slug, formatted_address, city, state_province, rating_average, rating_count, is_active, created_at, short_description, full_description')
    .eq('is_active', true)

  // If category filter is provided, find salons offering services in that category
  if (category) {
    const { data: servicesData } = await supabase
      .from('services_view')
      .select('salon_id, category_name')
      .eq('category_name', category)
      .eq('is_active', true) as { data: Service[] | null; error: PostgrestError | null }

    if (servicesData && servicesData.length > 0) {
      const salonIds = [...new Set(servicesData.map((s: Service) => s['salon_id']).filter(Boolean) as string[])]
      query = supabase.from('salons_view').select('id, name, slug, formatted_address, city, state_province, rating_average, rating_count, is_active, created_at, short_description, full_description').in('id', salonIds).eq('is_active', true)
    }
  }

  const { data, error } = await query
    .order('created_at', { ascending: false })
    .returns<Salon[]>()

  if (error) throw error
  return data || []
}

export async function getSalonBySlug(slug: string) {
  const logger = createOperationLogger('getSalonBySlug', { slug })
  logger.start()

  try {
    await requireAuth()
    const supabase = await createClient()

    // Explicit column selection for optimal bandwidth usage
    const { data, error } = await supabase
      .from('salons_view')
      .select('id, name, slug, formatted_address, city, state_province, rating_average, rating_count, is_active, created_at')
      .eq('slug', slug)
      .eq('is_active', true)
      .single() as { data: Salon | null; error: PostgrestError | null }

    if (error) {
      logger.error(error, 'database')
      throw error
    }

    logger.success(data)
    return data
  } catch (error) {
    logger.error(error instanceof Error ? error : String(error), 'system')
    throw error
  }
}
