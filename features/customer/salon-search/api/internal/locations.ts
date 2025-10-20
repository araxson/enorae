import 'server-only'
import { requireAuth } from '@/lib/auth'

export async function getPopularCities(): Promise<{ city: string; count: number }[]> {
  await requireAuth()
  console.warn('[CustomerSearch] getPopularCities is currently disabled until location analytics are provisioned.')
  return []
}

export async function getAvailableStates(): Promise<string[]> {
  await requireAuth()
  console.warn('[CustomerSearch] getAvailableStates is currently disabled until location analytics are provisioned.')
  return []
}
