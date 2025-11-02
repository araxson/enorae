'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { z } from 'zod'
import { createOperationLogger, logMutation, logError } from '@/lib/observability'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * Assign/reassign a salon to a chain
 */
export async function assignSalonToChain(formData: FormData) {
  const logger = createOperationLogger('assignSalonToChain', {})
  logger.start()

  try {
    await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
    const salonId = formData.get('salonId')?.toString()
    const chainId = formData.get('chainId')?.toString()

    if (!salonId || !UUID_REGEX.test(salonId)) return { error: 'Invalid salon ID' }
    if (chainId && !UUID_REGEX.test(chainId)) return { error: 'Invalid chain ID' }

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return { error: 'Unauthorized' }

    // Verify salon ownership
    const { data: salon } = await supabase
      .from('salons_view')
      .select('id, owner_id')
      .eq('id', salonId)
      .eq('owner_id', user['id'])
      .single()

    if (!salon) return { error: 'Salon not found or access denied' }

    // If chainId provided, verify chain ownership
    if (chainId) {
      const { data: chain } = await supabase
        .from('salon_chains_view')
        .select('id')
        .eq('id', chainId)
        .eq('owner_id', user['id'])
        .single()

      if (!chain) return { error: 'Chain not found or access denied' }
    }

    // Update salon's chain assignment
    const { error: updateError } = await supabase
      .schema('organization')
      .from('salons')
      .update({
        chain_id: chainId || null,
        updated_by_id: user['id'],
      })
      .eq('id', salonId)

    if (updateError) return { error: updateError.message }

    revalidatePath('/business/chains', 'page')
    revalidatePath('/business', 'layout')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to assign salon' }
  }
}
