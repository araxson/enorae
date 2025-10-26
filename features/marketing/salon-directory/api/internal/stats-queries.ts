import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

async function createPublicClient() {
  return createClient()
}

type SalonView = Database['public']['Views']['salons']['Row']

/**
 * Get platform statistics for homepage
 * Public endpoint - no auth required
 */
export async function getPublicPlatformStats(): Promise<{
  totalSalons: number
  totalCities: number
  totalServices: number
}> {
  const supabase = await createPublicClient()

  // Count active salons
  const { count: salonCount, error: salonError } = await supabase
    .from('salons')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)

  if (salonError) throw salonError

  // Count unique cities
  const { data: cities, error: citiesError } = await supabase
    .from('salons')
    .select('city, state_province')
    .eq('is_active', true)
    .not('city', 'is', null)
    .returns<Array<Pick<SalonView, 'city' | 'state_province'>>>()

  if (citiesError) throw citiesError

  const uniqueCities = new Set(
    (cities ?? [])
      .map((salon) =>
        salon.city && salon.state_province
          ? `${salon.city}-${salon.state_province}`
          : null,
      )
      .filter((entry): entry is string => Boolean(entry)),
  )

  // Count active services
  const { count: servicesCount, error: servicesError } = await supabase
    .from('services')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)

  if (servicesError) throw servicesError

  return {
    totalSalons: salonCount || 0,
    totalCities: uniqueCities.size,
    totalServices: servicesCount || 0,
  }
}
