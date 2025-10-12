import 'server-only'

import { createClient } from '@/lib/supabase/server'
import type { User } from '@supabase/supabase-js'

export interface SessionContext {
  supabase: Awaited<ReturnType<typeof createClient>>
  user: User
}

export async function requireSessionContext(): Promise<SessionContext> {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data.user) {
    throw new Error('Unauthorized')
  }

  return { supabase, user: data.user }
}
