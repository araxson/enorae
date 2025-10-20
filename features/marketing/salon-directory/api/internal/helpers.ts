import 'server-only'

import { createClient } from '@/lib/supabase/server'
import type { ServerSupabaseClient } from '@/lib/supabase/server'

/**
 * Create a Supabase client for public endpoints (no auth required)
 */
export async function createPublicClient(): Promise<ServerSupabaseClient> {
  return createClient()
}
