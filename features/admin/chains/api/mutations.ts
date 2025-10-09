'use server'

import { revalidatePath } from 'next/cache'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { createServiceRoleClient } from '@/lib/supabase/service-role'

/**
 * Approve/verify a salon chain
 */
export async function verifyChain(data: {
  chainId: string
  isVerified: boolean
  notes?: string
}) {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = createServiceRoleClient()

  const { error } = await supabase
    .schema('organization')
    .from('salon_chains')
    .update({
      is_verified: data.isVerified,
      verified_at: data.isVerified ? new Date().toISOString() : null
    })
    .eq('id', data.chainId)

  if (error) throw error

  revalidatePath('/admin/chains')
  return { success: true, message: `Chain ${data.isVerified ? 'verified' : 'unverified'} successfully` }
}

/**
 * Update chain active status
 */
export async function updateChainActiveStatus(data: {
  chainId: string
  isActive: boolean
  reason?: string
}) {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = createServiceRoleClient()

  const { error } = await supabase
    .schema('organization')
    .from('salon_chains')
    .update({
      is_active: data.isActive
    })
    .eq('id', data.chainId)

  if (error) throw error

  revalidatePath('/admin/chains')
  return { success: true, message: `Chain ${data.isActive ? 'activated' : 'deactivated'} successfully` }
}

/**
 * Update chain subscription tier
 */
export async function updateChainSubscription(data: {
  chainId: string
  subscriptionTier: string
}) {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = createServiceRoleClient()

  const { error } = await supabase
    .schema('organization')
    .from('salon_chains')
    .update({
      subscription_tier: data.subscriptionTier
    })
    .eq('id', data.chainId)

  if (error) throw error

  revalidatePath('/admin/chains')
  return { success: true, message: 'Subscription tier updated successfully' }
}

/**
 * Soft delete a chain
 */
export async function deleteChain(data: {
  chainId: string
  reason: string
}) {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = createServiceRoleClient()

  const { error } = await supabase
    .schema('organization')
    .from('salon_chains')
    .update({
      deleted_at: new Date().toISOString(),
      is_active: false
    })
    .eq('id', data.chainId)

  if (error) throw error

  revalidatePath('/admin/chains')
  return { success: true, message: 'Chain deleted successfully' }
}

/**
 * Restore a deleted chain
 */
export async function restoreChain(chainId: string) {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = createServiceRoleClient()

  const { error } = await supabase
    .schema('organization')
    .from('salon_chains')
    .update({
      deleted_at: null
    })
    .eq('id', chainId)

  if (error) throw error

  revalidatePath('/admin/chains')
  return { success: true, message: 'Chain restored successfully' }
}
