import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'
import { createOperationLogger } from '@/lib/observability/logger'

type Service = Database['public']['Views']['services_view']['Row']
type Salon = Database['public']['Views']['salons_view']['Row']

/**
 * Get all unique service categories with counts
 * Public endpoint - no auth required
 */
export async function getPublicServiceCategories(): Promise<
  {
    name: string; slug: string; count: number
  }[]
> {
  const logger = createOperationLogger('getPublicServiceCategories', {})
  logger.start()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('services_view')
    .select('category_name, category_slug')
    .eq('is_active', true)
    .is('deleted_at', null)
    .not('category_name', 'is', null)
    .not('category_slug', 'is', null)

  if (error) throw error

  const categoryRows = (data ?? []) as Array<Pick<Service, 'category_name' | 'category_slug'>>

  // Count occurrences of each category
  const categoryMap: Record<string, { name: string; slug: string; count: number }> = {}

  categoryRows.forEach((service) => {
    if (service.category_name && service.category_slug) {
      const key = service.category_slug
      if (!categoryMap[key]) {
        categoryMap[key] = {
          name: service.category_name,
          slug: service.category_slug,
          count: 0,
        }
      }
      categoryMap[key].count++
    }
  })

  // Convert to array and sort by count (descending)
  return Object.values(categoryMap).sort((a, b) => b.count - a.count)
}

/**
 * Get category by slug with stats
 * Public endpoint - no auth required
 */
export async function getPublicCategoryBySlug(
  slug: string
): Promise<{ name: string; slug: string; count: number } | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('services_view')
    .select('category_name, category_slug')
    .eq('is_active', true)
    .is('deleted_at', null)
    .ilike('category_slug', slug)

  if (error) throw error

  const services = (data ?? []) as Array<Pick<Service, 'category_name' | 'category_slug'>>

  if (services.length === 0) return null

  const firstService = services[0]
  if (!firstService || !firstService.category_name || !firstService.category_slug) return null

  return {
    name: firstService.category_name,
    slug: firstService.category_slug,
    count: services.length,
  }
}

/**
 * Get salons offering a specific service category
 * Public endpoint - no auth required
 */
export async function getSalonsOfferingCategory(categorySlug: string): Promise<Salon[]> {
  const supabase = await createClient()

  // First, get all service IDs in this category
  const { data: services, error: servicesError } = await supabase
    .from('services_view')
    .select('salon_id')
    .eq('is_active', true)
    .is('deleted_at', null)
    .ilike('category_slug', categorySlug)

  if (servicesError) throw servicesError

  const serviceRows = (services ?? []) as Array<Pick<Service, 'salon_id'>>

  if (serviceRows.length === 0) return []

  // Get unique salon IDs
  const salonIds = [...new Set(serviceRows.map((s) => s.salon_id).filter(Boolean) as string[])]

  // Get full salon details
  const { data: salons, error: salonsError } = await supabase
    .from('salons_view')
    .select('*')
    .in('id', salonIds)
    .eq('is_active', true)
    .order('rating_average', { ascending: false, nullsFirst: false })

  if (salonsError) throw salonsError
  return (salons ?? []) as Salon[]
}
