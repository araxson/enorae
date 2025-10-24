import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'
import type { PostgrestError } from '@supabase/supabase-js'

type ServiceCategoryRow = Database['public']['Views']['service_categories_view']['Row']

/**
 * Get all unique service categories
 */
export async function getServiceCategories(): Promise<string[]> {
  await requireAuth()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('service_categories_view')
    .select('name')
    .order('name', { ascending: true }) as { data: Array<Pick<ServiceCategoryRow, 'name'>> | null; error: PostgrestError | null }

  if (error) throw error

  // Get unique category names
  const uniqueCategories = [
    ...new Set((data || []).map((category) => category.name).filter(Boolean) as string[]),
  ]
  return uniqueCategories
}

/**
 * Get popular categories based on service count
 */
export async function getPopularCategories(limit: number = 10): Promise<{ category: string; count: number }[]> {
  await requireAuth()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('service_categories_view')
    .select('name, active_services_count')
    .order('active_services_count', { ascending: false, nullsLast: true })
    .limit(limit) as {
      data: Array<Pick<ServiceCategoryRow, 'name' | 'active_services_count'>> | null
      error: PostgrestError | null
    }

  if (error) throw error

  return (data || [])
    .filter((category): category is { name: string; active_services_count: number | null } =>
      Boolean(category?.name)
    )
    .map((category) => ({
      category: category.name,
      count: category.active_services_count ?? 0,
    }))
}
