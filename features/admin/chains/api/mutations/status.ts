'use server'

import { revalidatePath } from 'next/cache'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { sanitizeAdminText } from '@/features/admin/admin-common'
import type { Tables } from '@/lib/types/database.types'
import { updateChainActiveStatusSchema } from './schemas'
import { logChainAudit } from './audit'
import { createOperationLogger, logMutation, logError } from '@/lib/observability/logger'

type ChainActionResponse =
  | { success: true; message: string }
  | { success: false; error: string }

type SalonChainRow = Tables<{ schema: 'organization' }, 'salon_chains'>

/**
 * Update chain active status
 */
export async function updateChainActiveStatus(data: {
  chainId: string
  isActive: boolean
  reason: string
}): Promise<ChainActionResponse> {
  const logger = createOperationLogger('updateChainActiveStatus', {})
  logger.start()

  try {
    const parsed = updateChainActiveStatusSchema.safeParse(data)
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid chain status payload' }
    }

    const { chainId, isActive } = parsed.data
    const reason = sanitizeAdminText(parsed.data.reason, 'No reason provided')

    const session = await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
    const supabase = createServiceRoleClient()

    const { data: existingChain, error: fetchError } = await supabase
      .schema('organization')
      .from('salon_chains')
      .select('is_active')
      .eq('id', chainId)
      .maybeSingle<Pick<SalonChainRow, 'is_active'>>()

    if (fetchError) {
      return { success: false, error: fetchError.message }
    }

    const { error } = await supabase
      .schema('organization')
      .from('salon_chains')
      .update({ is_active: isActive })
      .eq('id', chainId)

    if (error) {
      return { success: false, error: error.message }
    }

    await logChainAudit(supabase, session.user.id, chainId, 'chain_activation_updated', 'warning', {
      previous_status: existingChain?.is_active ?? null,
      new_status: isActive,
      reason,
    })

    revalidatePath('/admin/chains', 'page')
    return {
      success: true,
      message: `Chain ${isActive ? 'activated' : 'deactivated'} successfully`,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update chain status',
    }
  }
}
