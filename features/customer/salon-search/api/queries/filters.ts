import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { createOperationLogger } from '@/lib/observability'

export async function getPopularCities(): Promise<{
  city: string; count: number
}[]> {
  const logger = createOperationLogger('getPopularCities', {})
  logger.start()
  await requireAuth()
  const supabase = await createClient()

  type SalonRow = {
    address: { city?: string } | null
  }

  // Get all salons to extract cities from public view
  const { data: salons, error } = await supabase
    .from('salons_view')
    .select('address')
    .returns<SalonRow[]>()

  if (error) throw error

  // Count salons by city
  const cityCounts = new Map<string, number>()

  salons?.forEach((salon) => {
    const city = salon.address?.city
    if (city) {
      cityCounts.set(city, (cityCounts.get(city) || 0) + 1)
    }
  })

  // Convert to array and sort by count
  return Array.from(cityCounts.entries())
    .map(([city, count]) => ({ city, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
}

export async function getAvailableStates(): Promise<string[]> {
  await requireAuth()
  const supabase = await createClient()

  type SalonRow = {
    address: { state?: string } | null
  }

  const { data: salons, error } = await supabase
    .from('salons_view')
    .select('address')
    .returns<SalonRow[]>()

  if (error) throw error

  // Extract unique states
  const states = new Set<string>()

  salons?.forEach((salon) => {
    const state = salon.address?.state
    if (state) {
      states.add(state)
    }
  })

  return Array.from(states).sort()
}
