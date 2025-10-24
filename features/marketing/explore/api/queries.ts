import 'server-only'

import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type Salon = Database['public']['Views']['salons']['Row']

/**
 * Public salon listing for marketing explore page.
 * Fetches a curated set of active salons without requiring authentication.
 */
export const getPublicSalons = cache(async function getPublicSalons(
  limit: number = 24,
): Promise<Salon[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('salons')
    .select('*')
    .eq('is_active', true)
    .order('rating_average', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Failed to load public salons', error)
    return []
  }

  return (data ?? []) as Salon[]
})
