import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

async function createPublicClient() {
  return createClient()
}

type SalonView = Database['public']['Views']['salons']['Row']

/**
 * Get unique cities where salons are located
 * Public endpoint - no auth required
 */
export async function getPublicSalonCities(): Promise<{ city: string; state: string; count: number }[]> {
  const supabase = await createPublicClient()

  const { data, error } = await supabase
    .from('salons')
    .select('city, state_province, is_active')
    .eq('is_active', true)
    .not('city', 'is', null)
    .not('state_province', 'is', null)
    .returns<Array<Pick<SalonView, 'city' | 'state_province' | 'is_active'>>>()

  if (error) throw error

  // Group by city and state
  const cityMap: Record<string, { city: string; state: string; count: number }> = {}

  ;(data ?? []).forEach((salon) => {
    if (salon.city && salon.state_province) {
      const key = `${salon.city}-${salon.state_province}`
      if (!cityMap[key]) {
        cityMap[key] = {
          city: salon.city,
          state: salon.state_province,
          count: 0,
        }
      }
      cityMap[key].count++
    }
  })

  return Object.values(cityMap).sort((a, b) => b.count - a.count)
}
