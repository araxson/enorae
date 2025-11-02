import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'
import { createOperationLogger } from '@/lib/observability/logger'

type Service = Database['public']['Views']['services_view']['Row']

/**
 * Get unique service categories from all salons
 * Public endpoint - no auth required
 */
export async function getPublicServiceCategories(): Promise<string[]> {
  const logger = createOperationLogger('getPublicServiceCategories', {})
  logger.start()

  const supabase = await createClient()

  type ServiceRow = { category_name: string | null }

  const { data, error } = await supabase
    .from('services_view')
    .select('category_name')
    .eq('is_active', true)
    .not('category_name', 'is', null)

  if (error) throw error

  // Get unique categories
  const categories = [...new Set((data || []).map((s: ServiceRow) => s.category_name).filter(Boolean) as string[])]
  return categories.sort()
}

/**
 * Get services offered by a salon
 * Public endpoint - no auth required
 */
export async function getPublicSalonServices(salonId: string): Promise<Service[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('services_view')
    .select('*')
    .eq('salon_id', salonId)
    .eq('is_active', true)
    .order('category_name', { ascending: true })
    .order('name', { ascending: true })
    .returns<Service[]>()

  if (error) throw error
  return data as Service[]
}
