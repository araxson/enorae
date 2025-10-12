'use server'

import { revalidatePath } from 'next/cache'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { sanitizeAdminText } from '@/features/admin/admin-common/utils/sanitize'
import {
  chainIdSchema,
  deleteChainSchema,
  updateChainActiveStatusSchema,
  updateChainSubscriptionSchema,
  verifyChainSchema,
} from './schemas'

type ChainActionResponse =
  | { success: true; message: string }
  | { success: false; error: string }

async function logChainAudit(
  supabase: ReturnType<typeof createServiceRoleClient>,
  userId: string,
  chainId: string,
  eventType: string,
  severity: 'info' | 'warning' | 'critical',
  metadata: Record<string, unknown>,
) {
  const { error } = await supabase.schema('audit').from('audit_logs').insert({
    event_type: eventType,
    event_category: 'chain_management',
    severity,
    user_id: userId,
    action: eventType,
    entity_type: 'chain',
    entity_id: chainId,
    metadata,
    is_success: true,
  })

  if (error) {
    console.error('[ChainAudit] Failed to record audit log', error)
  }
}

/**
 * Approve/verify a salon chain
 */
export async function verifyChain(data: {
  chainId: string
  isVerified: boolean
  reason: string
}): Promise<ChainActionResponse> {
  try {
    const parsed = verifyChainSchema.safeParse(data)
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0]?.message ?? 'Invalid chain payload' }
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
      .maybeSingle()

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

    revalidatePath('/admin/chains')
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

/**
 * Update chain active status
 */
export async function updateChainActiveStatus(data: {
  chainId: string
  isActive: boolean
  reason: string
}): Promise<ChainActionResponse> {
  try {
    const parsed = updateChainActiveStatusSchema.safeParse(data)
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0]?.message ?? 'Invalid chain status payload' }
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
      .maybeSingle()

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

    revalidatePath('/admin/chains')
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
      .maybeSingle()

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
      .from('salon_chains')
      .select('is_active, deleted_at')
      .eq('id', chainId)
      .maybeSingle()

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

    revalidatePath('/admin/chains')
    return { success: true, message: 'Chain restored successfully' }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to restore chain',
    }
  }
}
