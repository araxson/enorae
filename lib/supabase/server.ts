'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { env } from '@/lib/env'
import type { Database } from '@/lib/types/database.types'

const initServerClient = (
  url: string,
  anonKey: string,
  options: Parameters<typeof createServerClient>[2],
) => createServerClient<Database>(url, anonKey, options)

export type ServerSupabaseClient = ReturnType<typeof initServerClient>

export async function createClient(): Promise<ServerSupabaseClient> {
  const cookieStore = await cookies()

  return initServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  )
}
