'use server'

import { revalidatePath } from 'next/cache'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { sanitizeAdminText } from '@/features/admin/common'
import type { Tables } from '@/lib/types/database.types'
import { chainIdSchema, deleteChainSchema } from './schemas'
import { logChainAudit } from './audit'
import { createOperationLogger, logMutation, logError } from '@/lib/observability'

type ChainActionResponse =
  | { success: true; message: string }
  | { success: false; error: string }

type SalonChainRow = Tables<{ schema: 'organization' }, 'salon_chains'>

/**
 * Soft delete a chain
 */
export async function deleteChain(data: {
  chainId: string
  reason: string
}): Promise<ChainActionResponse> {
  const logger = createOperationLogger('deleteChain', {})
  logger.start()

  try {
    const parsed = deleteChainSchema.safeParse(data)
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors
      const firstError = Object.values(fieldErrors)[0]?.[0]
      return { success: false, error: firstError ?? 'Invalid deletion payload' }
    }

    const { chainId } = parsed.data
    const reason = sanitizeAdminText(parsed.data.reason, 'No reason provided')

    const session = await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
    const supabase = createServiceRoleClient()

    const { data: existingChain, error: fetchError } = await supabase
      .schema('organization')
      .from('salon_chains')
      .select('is_active, deleted_at')
      .eq('id', chainId)
      .maybeSingle<Pick<SalonChainRow, 'is_active' | 'deleted_at'>>()

    if (fetchError) {
      return { success: false, error: fetchError.message }
    }

    const { error } = await supabase
      .schema('organization')
      .from('salon_chains')
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

    revalidatePath('/admin/chains', 'page')
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
      const fieldErrors = parsed.error.flatten().fieldErrors
      const firstError = Object.values(fieldErrors)[0]?.[0]
      return { success: false, error: firstError ?? 'Invalid chain identifier' }
    }

    const session = await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
    const supabase = createServiceRoleClient()

    const { error } = await supabase
      .schema('organization')
      .from('salon_chains')
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

    revalidatePath('/admin/chains', 'page')
    return { success: true, message: 'Chain restored successfully' }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to restore chain',
    }
  }
}
