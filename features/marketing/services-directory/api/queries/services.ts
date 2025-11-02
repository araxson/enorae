import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'
import { createOperationLogger } from '@/lib/observability'

type Service = Database['public']['Views']['services_view']['Row']

/**
 * Get all active public services with optional filters
 * Public endpoint - no auth required
 */
export async function getPublicServices(category?: string): Promise<Service[]> {
  const logger = createOperationLogger('getPublicServices', {})
  logger.start()

  const supabase = await createClient()

  let query = supabase
    .from('services_view')
    .select('*')
    .eq('is_active', true)
    .is('deleted_at', null)
    .order('name', { ascending: true })

  if (category) {
    query = query.ilike('category_name', category)
  }

  const { data, error } = await query

  if (error) throw error
  return (data ?? []) as Service[]
}

/**
 * Get featured services for homepage
 * Public endpoint - no auth required
 */
export async function getFeaturedServices(limit: number = 6): Promise<Service[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('services_view')
    .select('*')
    .eq('is_active', true)
    .eq('is_featured', true)
    .is('deleted_at', null)
    .order('name', { ascending: true })
    .limit(limit)

  if (error) throw error
  return (data ?? []) as Service[]
}

/**
 * Search services by name or description
 * Public endpoint - no auth required
 */
export async function searchPublicServices(searchTerm: string): Promise<Service[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('services_view')
    .select('*')
    .eq('is_active', true)
    .is('deleted_at', null)
    .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
    .order('name', { ascending: true })

  if (error) throw error
  return (data ?? []) as Service[]
}

/**
 * Get popular services based on featured flag and salon count
 * Public endpoint - no auth required
 */
export async function getPopularServices(limit: number = 10): Promise<
  {
    name: string
    category: string
    categorySlug: string
    salonCount: number
    avgPrice: number | null
  }[]
> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('services_view')
    .select('name, category_name, category_slug, salon_id, current_price')
    .eq('is_active', true)
    .is('deleted_at', null)
    .not('category_name', 'is', null)

  if (error) throw error

  const serviceRows = (data ?? []) as Array<
    Pick<Service, 'name' | 'category_name' | 'category_slug' | 'salon_id'> & {
      current_price: number | null
    }
  >

  // Group by service name and category
  const serviceMap: Record<
    string,
    {
      name: string
      category: string
      categorySlug: string
      salonIds: Set<string>
      prices: number[]
    }
  > = {}

  serviceRows.forEach((service) => {
    if (!service.name || !service.category_name || !service.category_slug) return

    const key = `${service.name}-${service.category_name}`
    if (!serviceMap[key]) {
      serviceMap[key] = {
        name: service.name,
        category: service.category_name,
        categorySlug: service.category_slug,
        salonIds: new Set(),
        prices: [],
      }
    }

    if (service.salon_id) {
      serviceMap[key].salonIds.add(service.salon_id)
    }
    if (service.current_price) {
      serviceMap[key].prices.push(service.current_price)
    }
  })

  // Convert to array with stats
  const popularServices = Object.values(serviceMap).map((service) => ({
    name: service.name,
    category: service.category,
    categorySlug: service.categorySlug,
    salonCount: service.salonIds.size,
    avgPrice:
      service.prices.length > 0
        ? service.prices.reduce((sum, price) => sum + price, 0) / service.prices.length
        : null,
  }))

  // Sort by salon count (most popular) and return limited results
  return popularServices.sort((a, b) => b.salonCount - a.salonCount).slice(0, limit)
}
