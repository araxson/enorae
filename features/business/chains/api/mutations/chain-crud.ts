'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { z } from 'zod'
import { createOperationLogger, logMutation, logError } from '@/lib/observability/logger'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const chainSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  legal_name: z.string().max(200).optional().or(z.literal('')),
})

export async function createSalonChain(formData: FormData) {
  const logger = createOperationLogger('createSalonChain', {})
  logger.start()

  try {
    // SECURITY: Business users only
    await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
    const result = chainSchema.safeParse({
      name: formData.get('name'),
      legal_name: formData.get('legal_name'),
    })

    if (!result.success) return { error: result.error.issues[0]?.message ?? 'Validation failed' }

    const data = result.data
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return { error: 'Unauthorized' }

    const { error: insertError } = await supabase
      .schema('organization')
      .from('salon_chains')
      .insert({
        id: crypto.randomUUID(),
        owner_id: user['id'],
        name: data['name'],
        legal_name: data['legal_name'] || null,
        slug: data['name'].toLowerCase().replace(/\s+/g, '-'),
        created_by_id: user['id'],
        updated_by_id: user['id'],
      })

    if (insertError) return { error: insertError.message }

    revalidatePath('/admin/chains', 'page')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to create chain' }
  }
}

export async function updateSalonChain(formData: FormData) {
  const logger = createOperationLogger('updateSalonChain', {})

  try {
    const id = formData.get('id')?.toString()
    if (!id || !UUID_REGEX.test(id)) {
      logger.error('Invalid chain ID', 'validation', { chainId: id })
      return { error: 'Invalid ID' }
    }

    logger.start({ chainId: id })

    // SECURITY: Business users only
    const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

    const result = chainSchema.safeParse({
      name: formData.get('name'),
      legal_name: formData.get('legal_name'),
    })

    if (!result.success) {
      logger.error(result.error.issues[0]?.message ?? 'Validation failed', 'validation', { chainId: id, userId: session.user.id })
      return { error: result.error.issues[0]?.message ?? 'Validation failed' }
    }

    const data = result.data
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      logger.error('Authentication failed', 'auth', { chainId: id })
      return { error: 'Unauthorized' }
    }

    const { error: updateError } = await supabase
      .schema('organization')
      .from('salon_chains')
      .update({
        name: data['name'],
        legal_name: data['legal_name'] || null,
        updated_by_id: user['id'],
      })
      .eq('id', id)
      .eq('owner_id', user['id'])

    if (updateError) {
      logger.error(updateError, 'database', { chainId: id, userId: user['id'] })
      return { error: updateError.message }
    }

    logMutation('update', 'salon_chain', id, {
      userId: user['id'],
      operationName: 'updateSalonChain',
      changes: { name: data['name'], legal_name: data['legal_name'] },
    })

    revalidatePath('/admin/chains', 'page')

    logger.success({ chainId: id, userId: user['id'], chainName: data['name'] })
    return { success: true }
  } catch (error) {
    logger.error(error instanceof Error ? error : String(error), 'system')
    return { error: error instanceof Error ? error.message : 'Failed to update chain' }
  }
}

export async function deleteSalonChain(formData: FormData) {
  const logger = createOperationLogger('deleteSalonChain', {})

  try {
    const id = formData.get('id')?.toString()
    if (!id || !UUID_REGEX.test(id)) {
      logger.error('Invalid chain ID', 'validation', { chainId: id })
      return { error: 'Invalid ID' }
    }

    logger.start({ chainId: id })

    // SECURITY: Business users only
    const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      logger.error('Authentication failed', 'auth', { chainId: id })
      return { error: 'Unauthorized' }
    }

    // Check if chain has salons
    const { count } = await supabase
      .from('salons_view')
      .select('*', { count: 'exact', head: true })
      .eq('chain_id', id)
      .is('deleted_at', null)

    if (count && count > 0) {
      logger.warn(`Cannot delete chain with active salons`, { chainId: id, activeSalonCount: count, userId: user['id'] })
      return { error: `Cannot delete chain with ${count} active salon(s)` }
    }

    console.log('Deleting salon chain', { chainId: id, userId: user['id'], timestamp: new Date().toISOString() })

    const { error: deleteError } = await supabase
      .schema('organization')
      .from('salon_chains')
      .update({
        deleted_at: new Date().toISOString(),
        updated_by_id: user['id'],
      })
      .eq('id', id)
      .eq('owner_id', user['id'])

    if (deleteError) {
      logger.error(deleteError, 'database', { chainId: id, userId: user['id'] })
      return { error: deleteError.message }
    }

    logMutation('delete', 'salon_chain', id, {
      userId: user['id'],
      operationName: 'deleteSalonChain',
    })

    revalidatePath('/business/chains', 'page')
    revalidatePath('/admin/chains', 'page')

    logger.success({ chainId: id, userId: user['id'] })
    return { success: true }
  } catch (error) {
    logger.error(error instanceof Error ? error : String(error), 'system')
    return { error: error instanceof Error ? error.message : 'Failed to delete chain' }
  }
}
