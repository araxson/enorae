import { cookies } from 'next/headers'
import { createServerClient as createDatabaseServerClient, createBrowserSupabaseClient } from '@enorae/database/client'

export async function createClient() {
  // Check if we're in a server context
  if (typeof window === 'undefined') {
    // Server-side: use cookies from Next.js
    const cookieStore = await cookies()
    return createDatabaseServerClient(cookieStore)
  }

  // Client-side: use browser client
  return createBrowserSupabaseClient()
}
