import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { ANALYTICS_CONFIG } from '@/lib/config/constants'

/**
 * Get search suggestions for salon names (for autocomplete)
 */
export async function getSalonSearchSuggestions(
  searchTerm: string,
  limit = ANALYTICS_CONFIG.DEFAULT_SEARCH_SUGGESTIONS_LIMIT
): Promise<{ name: string; slug: string }[]> {
  await requireAuth()

  if (!searchTerm || searchTerm.length < ANALYTICS_CONFIG.MIN_SEARCH_TERM_LENGTH) {
    return []
  }

  const supabase = await createClient()

  // Get salons that match the search term for autocomplete from public view
  const { data, error } = await supabase
    .from('salons_view')
    .select('name, slug')
    .ilike('name', `%${searchTerm}%`)
    .limit(limit)

  if (error) throw error

  return (data || []).map((salon: any) => ({
    name: salon.name || '',
    slug: salon.slug || '',
  }))
}
