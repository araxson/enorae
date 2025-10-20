import 'server-only'

import { createClient } from '@/lib/supabase/server'

export const createPublicClient = async () => {
  const client = await createClient()
  await client.auth.getUser().catch(() => ({ data: { user: null } }))
  return client
}
