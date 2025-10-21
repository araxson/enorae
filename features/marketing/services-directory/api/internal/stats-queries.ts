import 'server-only'
import { createPublicClient } from './helpers'
import type { Service } from './types'

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
  const supabase = await createPublicClient()

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
  const supabase = await createPublicClient()

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
