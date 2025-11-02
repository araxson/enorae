import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { createOperationLogger } from '@/lib/observability'

/**
 * Get platform statistics for homepage
 * Public endpoint - no auth required
 */
export async function getPublicPlatformStats(): Promise<{
  totalSalons: number
  totalCities: number
  totalServices: number
}> {
  const logger = createOperationLogger('getPublicPlatformStats', {})
  logger.start()
  const supabase = await createClient()

  // Count active salons
  const { count: salonCount, error: salonError } = await supabase
    .from('salons_view')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)

  if (salonError) throw salonError

  // Count unique cities
  type CityRow = { city: string | null; state_province: string | null }

  const { data: cities, error: citiesError } = await supabase
    .from('salons_view')
    .select('city, state_province')
    .eq('is_active', true)
    .not('city', 'is', null)

  if (citiesError) throw citiesError

  const uniqueCities = new Set((cities || []).map((s: CityRow) => `${s.city}-${s.state_province}`))

  // Count active services
  const { count: servicesCount, error: servicesError } = await supabase
    .from('services_view')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)

  if (servicesError) throw servicesError

  return {
    totalSalons: salonCount || 0,
    totalCities: uniqueCities.size,
    totalServices: servicesCount || 0,
  }
}
