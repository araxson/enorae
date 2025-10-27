import 'server-only'

import type { Session } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { assertSalonAccess, ensureBusinessUser, type SupabaseServerClient } from './shared'

type DeleteServiceOptions = {
  supabase?: SupabaseServerClient
  session?: Session
  now?: () => Date
  skipAccessCheck?: boolean
}

export async function deleteService(serviceId: string, options: DeleteServiceOptions = {}) {
  const session = options.session ?? await ensureBusinessUser()
  const { supabase } = await assertSalonAccess(serviceId, options.supabase, {
    skipAccessCheck: options.skipAccessCheck,
  })
  const now = options.now?.() ?? new Date()
  const timestamp = now.toISOString()

  const { error } = await supabase
    .schema('catalog')
    .from('services')
    .update({
      discontinued_at: timestamp,
      deleted_at: timestamp,
      deleted_by_id: session.user.id,
      is_active: false,
      is_bookable: false,
      updated_by_id: session.user.id,
      updated_at: timestamp,
    })
    .eq('id', serviceId)

  if (error) throw error

  revalidatePath('/business/services', 'page')
  return { success: true }
}
