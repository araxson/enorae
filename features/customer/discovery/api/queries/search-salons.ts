import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'
import type { PostgrestError } from '@supabase/supabase-js'
import { createOperationLogger } from '@/lib/observability'
import { discoverySearchSchema } from '@/features/customer/discovery/api/schema'

type Salon = Database['public']['Views']['salons_view']['Row']
type Service = Database['public']['Views']['services_view']['Row']

export async function searchSalons(query: string, categoryFilter?: string) {
  const logger = createOperationLogger('searchSalons', { query, categoryFilter })
  logger.start()

  try {
    await requireAuth()
    const supabase = await createClient()

    const { query: sanitizedQuery, category } = discoverySearchSchema.parse({
      query,
      category: categoryFilter,
    })

    let salonQuery = supabase
      .from('salons_view')
      .select('*')
      .eq('is_active', true)
      .ilike('name', `%${sanitizedQuery}%`)

    // If category filter is provided, find salons offering services in that category
    if (category) {
      const { data: servicesData, error: servicesError } = await supabase
        .from('services_view')
        .select('salon_id, category_name')
        .eq('category_name', category)
        .eq('is_active', true) as { data: Service[] | null; error: PostgrestError | null }

      if (servicesError) {
        logger.error(servicesError, 'database')
        throw servicesError
      }

      if (servicesData && servicesData.length > 0) {
        const salonIds = [...new Set(servicesData.map((s: Service) => s['salon_id']).filter(Boolean) as string[])]
        salonQuery = supabase
          .from('salons_view')
          .select('*')
          .in('id', salonIds)
          .eq('is_active', true)
          .ilike('name', `%${sanitizedQuery}%`)
      }
    }

    const { data, error } = await salonQuery.order('created_at', { ascending: false })

    if (error) {
      logger.error(error, 'database')
      throw error
    }

    logger.success(data)
    return data || []
  } catch (error) {
    logger.error(error instanceof Error ? error : String(error), 'system')
    throw error
  }
}
