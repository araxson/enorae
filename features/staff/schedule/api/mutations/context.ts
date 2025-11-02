'use server'

import { createClient } from '@/lib/supabase/server'
import { getSalonContext, requireAuth } from '@/lib/auth'
import type { ActionResult } from '../types'
import type { User } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/types/database.types'

export async function getScheduleContext() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { accessibleSalonIds } = await getSalonContext()
  if (!accessibleSalonIds.length) throw new Error('No accessible salons')

  return {
    userId: user.id,
    salonIds: accessibleSalonIds,
  }
}

export type AuthorizedContext = {
  supabase: SupabaseClient<Database>
  session: { user: User }
}

type AuthorizedContextResult =
  | { success: true; data: AuthorizedContext }
  | { success: false; error: string }

export async function getAuthorizedContext(
  salonId: string,
): Promise<AuthorizedContextResult> {
  try {
    await requireAuth()
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    const { accessibleSalonIds } = await getSalonContext()
    if (!accessibleSalonIds.includes(salonId)) {
      return { success: false, error: 'Unauthorized access to this salon' }
    }

    const context: AuthorizedContext = {
      supabase,
      session: { user },
    }

    return { success: true, data: context }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Authorization failed' }
  }
}
