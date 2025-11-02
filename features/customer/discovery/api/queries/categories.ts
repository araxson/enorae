import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'
import type { PostgrestError } from '@supabase/supabase-js'
import { createOperationLogger } from '@/lib/observability'
import { objectEntries } from '@/lib/utils/typed-object'
import { discoveryPaginationSchema } from '@/features/customer/discovery/api/schema'

type Service = Database['public']['Views']['services_view']['Row']
type ServiceCategory = Database['public']['Views']['service_categories_view']['Row']

export async function getServiceCategories(): Promise<string[]> {
  const logger = createOperationLogger('getServiceCategories', {})
  logger.start()

  try {
    await requireAuth()
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('service_categories_view')
      .select('name')
      .order('name', { ascending: true }) as { data: ServiceCategory[] | null; error: PostgrestError | null }

    if (error) {
      logger.error(error, 'database')
      throw error
    }

    // Get unique category names
    const uniqueCategories = [
      ...new Set((data || []).map((category) => category['name']).filter(Boolean) as string[]),
    ]

    logger.success(data)
    return uniqueCategories
  } catch (error) {
    logger.error(error instanceof Error ? error : String(error), 'system')
    throw error
  }
}

export async function getPopularCategories(limit: number = 10): Promise<{ category: string; count: number }[]> {
  const logger = createOperationLogger('getPopularCategories', { limit })
  logger.start()

  try {
    await requireAuth()
    const supabase = await createClient()

    const { limit: validatedLimit } = discoveryPaginationSchema.parse({ limit })

    const { data, error } = await supabase
      .from('services_view')
      .select('category_name')
      .eq('is_active', true)
      .not('category_name', 'is', null) as { data: Service[] | null; error: PostgrestError | null }

    if (error) {
      logger.error(error, 'database')
      throw error
    }

    // Count occurrences of each category
    const categoryCounts: Record<string, number> = {}
    ;(data || []).forEach((service) => {
      if (service['category_name']) {
        categoryCounts[service['category_name']] = (categoryCounts[service['category_name']] || 0) + 1
      }
    })

    // Convert to array and sort by count
    const sortedCategories = objectEntries(categoryCounts)
      .map(([category, count]) => ({ category, count: count as number }))
      .sort((a, b) => b.count - a.count)
      .slice(0, validatedLimit)

    logger.success(data)
    return sortedCategories
  } catch (error) {
    logger.error(error instanceof Error ? error : String(error), 'system')
    throw error
  }
}
