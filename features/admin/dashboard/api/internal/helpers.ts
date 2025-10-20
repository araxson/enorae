import { logSupabaseError } from '@/lib/supabase/errors'

/**
 * Safely extract count from settled promise with error logging
 */
export function safeCountFromSettled(
  result: PromiseSettledResult<{ count: number | null; error: unknown }>,
  context: string
): number {
  if (result.status === 'rejected') {
    logSupabaseError(`getPlatformMetrics:${context}`, result.reason)
    return 0
  }
  if (result.value.error) {
    logSupabaseError(`getPlatformMetrics:${context}`, result.value.error)
    return 0
  }
  return typeof result.value.count === 'number' ? result.value.count : 0
}
