import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { env } from '@/lib/env'

let cachedClient: SupabaseClient<any, any, any> | null = null
let cachedKey: string | null = null

export function createServiceRoleClient() {
  if (!env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      '[Supabase] SUPABASE_SERVICE_ROLE_KEY is required to access admin resources. Set this value in your environment (see readme.md for details).'
    )
  }

  if (!cachedClient || cachedKey !== env.SUPABASE_SERVICE_ROLE_KEY) {
    cachedClient = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }) as SupabaseClient<any, any, any>
    cachedKey = env.SUPABASE_SERVICE_ROLE_KEY
  }

  return cachedClient
}
