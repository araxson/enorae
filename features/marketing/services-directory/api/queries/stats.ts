import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type Service = Database['public']['Views']['services_view']['Row']

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
