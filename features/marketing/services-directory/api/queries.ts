import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type Service = Database['public']['Views']['services_view']['Row']
type ServiceCategory = Database['public']['Views']['service_categories_view']['Row']
type Salon = Database['public']['Views']['salons_view']['Row']

/**
 * Get all active public services with optional filters
 * Public endpoint - no auth required
 */
export async function getPublicServices(category?: string): Promise<Service[]> {
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
 * Get all unique service categories with counts
 * Public endpoint - no auth required
 */
export async function getPublicServiceCategories(): Promise<
  { name: string; slug: string; count: number }[]
> {
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

/**
 * Get service statistics for homepage
 * Public endpoint - no auth required
 */
export async function getPublicServiceStats(): Promise<{
  totalServices: number
  totalCategories: number
  avgPrice: number | null
}> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('services_view')
    .select('current_price, category_name')
    .eq('is_active', true)
    .is('deleted_at', null)

  if (error) throw error

  const rows = (data ?? []) as Array<
    Pick<Service, 'category_name'> & { current_price: number | null }
  >

  const categories = new Set(rows.map((s) => s.category_name).filter(Boolean))
  const prices = rows.map((s) => s.current_price).filter((value): value is number => value != null)
  const avgPrice = prices.length > 0 ? prices.reduce((sum, p) => sum + p, 0) / prices.length : null

  return {
    totalServices: rows.length,
    totalCategories: categories.size,
    avgPrice,
  }
}
