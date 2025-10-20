import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

type ServiceRow = Database['public']['Views']['services']['Row']

/**
 * Get all unique service categories
 */
export async function getServiceCategories(): Promise<string[]> {
  await requireAuth()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('services')
    .select('category_name')
    .eq('is_active', true)
    .not('category_name', 'is', null)
    .returns<Array<Pick<ServiceRow, 'category_name'>>>()

  if (error) throw error

  // Get unique category names
  const uniqueCategories = [...new Set(data.map(s => s.category_name).filter(Boolean) as string[])]
  return uniqueCategories.sort()
}

/**
 * Get popular categories based on service count
 */
export async function getPopularCategories(limit: number = 10): Promise<{ category: string; count: number }[]> {
  await requireAuth()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('services')
    .select('category_name')
    .eq('is_active', true)
    .not('category_name', 'is', null)
    .returns<Array<Pick<ServiceRow, 'category_name'>>>()

  if (error) throw error

  // Count occurrences of each category
  const categoryCounts: Record<string, number> = {}
  data.forEach((service) => {
    if (service.category_name) {
      categoryCounts[service.category_name] = (categoryCounts[service.category_name] || 0) + 1
    }
  })

  // Convert to array and sort by count
  const sortedCategories = Object.entries(categoryCounts)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)

  return sortedCategories
}
