'use server'

import { revalidatePath } from 'next/cache'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { sanitizeAdminText } from '@/features/admin/admin-common/api/text-sanitizers'
import { chainIdSchema, deleteChainSchema } from '../schemas'
import type { ChainActionResponse } from './types'
import { logChainAudit } from './audit'

/**
 * Soft delete a chain
 */
export async function deleteChain(data: {
  chainId: string
  reason: string
}): Promise<ChainActionResponse> {
  try {
    const parsed = deleteChainSchema.safeParse(data)
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0]?.message ?? 'Invalid deletion payload' }
    }

    const { chainId } = parsed.data
    const reason = sanitizeAdminText(parsed.data.reason, 'No reason provided')

    const session = await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
    const supabase = createServiceRoleClient()

    const { data: existingChain, error: fetchError } = await supabase
      .schema('organization')
      .from('salon_chains_view')
      .select('is_active, deleted_at')
      .eq('id', chainId)
      .maybeSingle()

    if (fetchError) {
      return { success: false, error: fetchError.message }
    }

    const { error } = await supabase
      .schema('organization')
      .from('salon_chains_view')
      .update({
        deleted_at: new Date().toISOString(),
        is_active: false,
      })
      .eq('id', chainId)

    if (error) {
      return { success: false, error: error.message }
    }

    await logChainAudit(supabase, session.user.id, chainId, 'chain_deleted', 'critical', {
      previous_is_active: existingChain?.is_active ?? null,
      previous_deleted_at: existingChain?.deleted_at ?? null,
      reason,
    })

    revalidatePath('/admin/chains')
    return { success: true, message: 'Chain deleted successfully' }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete chain',
    }
  }
}

/**
 * Restore a deleted chain
 */
export async function restoreChain(chainId: string): Promise<ChainActionResponse> {
  try {
    const parsed = chainIdSchema.safeParse(chainId)
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0]?.message ?? 'Invalid chain identifier' }
    }

    const session = await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
    const supabase = createServiceRoleClient()

    const { error } = await supabase
      .schema('organization')
      .from('salon_chains_view')
      .update({
        deleted_at: null,
      })
      .eq('id', parsed.data)

    if (error) {
      return { success: false, error: error.message }
    }

    await logChainAudit(supabase, session.user.id, parsed.data, 'chain_restored', 'info', {
      restored_at: new Date().toISOString(),
    })

    revalidatePath('/admin/chains')
    return { success: true, message: 'Chain restored successfully' }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to restore chain',
    }
  }
}
