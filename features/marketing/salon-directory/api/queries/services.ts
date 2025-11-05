import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'
import { createOperationLogger } from '@/lib/observability'

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
  if (!data) return []

  // Get unique categories - filter ensures only string values
  const categories = [...new Set(data.map((s) => s.category_name).filter((name): name is string => Boolean(name)))]
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
    .select('id, salon_id, name, category_name, category_slug, description, duration_minutes, is_active, created_at')
    .eq('salon_id', salonId)
    .eq('is_active', true)
    .order('category_name', { ascending: true })
    .order('name', { ascending: true })
    .returns<Service[]>()

  if (error) throw error
  if (!data) return []

  return data
}
