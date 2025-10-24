import 'server-only'
import { createPublicClient } from './helpers'
import type { Service, Salon } from './types'

/**
 * Get salons offering a specific service category
 * Public endpoint - no auth required
 */
export async function getSalonsOfferingCategory(categorySlug: string): Promise<Salon[]> {
  const supabase = await createPublicClient()

  // First, get all service IDs in this category
  const { data: services, error: servicesError } = await supabase
    .from('services')
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
    .from('salons')
    .select('*')
    .in('id', salonIds)
    .eq('is_active', true)
    .order('rating_average', { ascending: false, nullsFirst: false })

  if (salonsError) throw salonsError
  return (salons ?? []) as Salon[]
}
