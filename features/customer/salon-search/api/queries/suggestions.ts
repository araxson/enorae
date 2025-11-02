import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { ANALYTICS_CONFIG } from '@/lib/config/constants'
import { createOperationLogger } from '@/lib/observability/logger'

/**
 * Get search suggestions for salon names (for autocomplete)
 */
export async function getSalonSearchSuggestions(
  searchTerm: string,
  limit = ANALYTICS_CONFIG.DEFAULT_SEARCH_SUGGESTIONS_LIMIT
): Promise<{ name: string; slug: string }[]> {
  const logger = createOperationLogger('getSalonSearchSuggestions', {})
  logger.start()

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

  type SalonSuggestion = { name: string | null; slug: string | null }

  const isSalonSuggestion = (item: unknown): item is SalonSuggestion => {
    return item !== null && typeof item === 'object' && 'name' in item && 'slug' in item
  }

  return (data || []).filter(isSalonSuggestion).map((salon) => ({
    name: salon.name || '',
    slug: salon.slug || '',
  }))
}
