'use server'

import { revalidatePath } from 'next/cache'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { sanitizeAdminText } from '@/features/admin/admin-common/api/text-sanitizers'
import { updateChainSubscriptionSchema } from '@/features/admin/chains/api/schemas'
import type { ChainActionResponse } from './types'
import { logChainAudit } from './audit'
import type { Tables } from '@/lib/types/database.types'

type SalonChainRow = Tables<{ schema: 'organization' }, 'salon_chains'>

/**
 * Update chain subscription tier
 */
export async function updateChainSubscription(data: {
  chainId: string
  subscriptionTier: string
  reason?: string
}): Promise<ChainActionResponse> {
  try {
    const parsed = updateChainSubscriptionSchema.safeParse(data)
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0]?.message ?? 'Invalid subscription payload' }
    }

    const { chainId, subscriptionTier } = parsed.data
    const reason = sanitizeAdminText(parsed.data.reason, 'No reason provided')

    const session = await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
    const supabase = createServiceRoleClient()

    const { data: existingChain, error: fetchError } = await supabase
      .schema('organization')
      .from('salon_chains')
      .select('subscription_tier')
      .eq('id', chainId)
      .maybeSingle<Pick<SalonChainRow, 'subscription_tier'>>()

    if (fetchError) {
      return { success: false, error: fetchError.message }
    }

    const { error } = await supabase
      .schema('organization')
      .from('salon_chains')
      .update({
        subscription_tier: subscriptionTier,
      })
      .eq('id', chainId)

    if (error) {
      return { success: false, error: error.message }
    }

    await logChainAudit(supabase, session.user.id, chainId, 'chain_subscription_updated', 'info', {
      previous_tier: existingChain?.subscription_tier ?? null,
      new_tier: subscriptionTier,
      reason,
    })

    revalidatePath('/admin/chains')
    return { success: true, message: 'Subscription tier updated successfully' }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update chain subscription',
    }
  }
}
