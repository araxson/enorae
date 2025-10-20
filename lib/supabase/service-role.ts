import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { env } from '@/lib/env'
import type { Database } from '@/lib/types/database.types'

let cachedClient: SupabaseClient<Database> | null = null
let cachedKey: string | null = null

export function createServiceRoleClient(): SupabaseClient<Database> {
  if (!env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      '[Supabase] SUPABASE_SERVICE_ROLE_KEY is required to access admin resources. Set this value in your environment (see readme.md for details).'
    )
  }

  if (!cachedClient || cachedKey !== env.SUPABASE_SERVICE_ROLE_KEY) {
    cachedClient = createClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
    cachedKey = env.SUPABASE_SERVICE_ROLE_KEY
  }

  return cachedClient
}
