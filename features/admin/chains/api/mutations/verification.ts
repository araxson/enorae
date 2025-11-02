'use server'

import { revalidatePath } from 'next/cache'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { sanitizeAdminText } from '@/features/admin/admin-common'
import type { Tables } from '@/lib/types/database.types'
import { verifyChainSchema } from './schemas'
import { logChainAudit } from './audit'
import { createOperationLogger, logMutation, logError } from '@/lib/observability/logger'

type ChainActionResponse =
  | { success: true; message: string }
  | { success: false; error: string }

type SalonChainRow = Tables<{ schema: 'organization' }, 'salon_chains'>

/**
 * Approve/verify a salon chain
 */
export async function verifyChain(data: {
  chainId: string
  isVerified: boolean
  reason: string
}): Promise<ChainActionResponse> {
  const logger = createOperationLogger('verifyChain', {})
  logger.start()

  try {
    const parsed = verifyChainSchema.safeParse(data)
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid chain payload' }
    }

    const { chainId, isVerified } = parsed.data
    const reason = sanitizeAdminText(parsed.data.reason, 'No reason provided')

    const session = await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
    const supabase = createServiceRoleClient()

    const { data: existingChain, error: fetchError } = await supabase
      .schema('organization')
      .from('salon_chains')
      .select('is_verified, verified_at')
      .eq('id', chainId)
      .maybeSingle<Pick<SalonChainRow, 'is_verified' | 'verified_at'>>()

    if (fetchError) {
      return { success: false, error: fetchError.message }
    }

    const { error } = await supabase
      .schema('organization')
      .from('salon_chains')
      .update({
        is_verified: isVerified,
        verified_at: isVerified ? new Date().toISOString() : null,
      })
      .eq('id', chainId)

    if (error) {
      return { success: false, error: error.message }
    }

    await logChainAudit(supabase, session.user.id, chainId, 'chain_verification_updated', 'warning', {
      previous_status: existingChain?.is_verified ?? null,
      new_status: isVerified,
      reason,
    })

    revalidatePath('/admin/chains', 'page')
    return {
      success: true,
      message: `Chain ${isVerified ? 'verified' : 'unverified'} successfully`,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update chain verification',
    }
  }
}
