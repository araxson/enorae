import 'server-only'

import { createClient } from '@/lib/supabase/server'
import type { User } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/types/database.types'

export interface SessionContext {
  supabase: SupabaseClient<Database>
  user: User
}

/**
 * Require authentication and return session context
 * Used by session management mutations and queries
 *
 * @throws Error if not authenticated
 */
export async function requireSessionContext(): Promise<SessionContext> {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error('Unauthorized - Authentication required')
  }

  return {
    supabase,
    user,
  }
}
