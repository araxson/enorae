import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Service } from './types'

async function createPublicClient() {
  const client = await createClient()
  await client.auth.getUser().catch(() => ({ data: { user: null } }))
  return client
}

/**
 * Get all unique service categories with counts
 * Public endpoint - no auth required
 */
export async function getPublicServiceCategories(): Promise<
  { name: string; slug: string; count: number }[]
> {
  const supabase = await createPublicClient()

  const { data, error } = await supabase
    .from('services')
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
  const supabase = await createPublicClient()

  const { data, error } = await supabase
    .from('services')
    .select('category_name, category_slug')
    .eq('is_active', true)
    .is('deleted_at', null)
    .ilike('category_slug', slug)

  if (error) throw error

  const services = (data ?? []) as Array<Pick<Service, 'category_name' | 'category_slug'>>

  if (services.length === 0) return null

  const firstService = services[0]
  if (!firstService.category_name || !firstService.category_slug) return null

  return {
    name: firstService.category_name,
    slug: firstService.category_slug,
    count: services.length,
  }
}
