'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { z } from 'zod'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const chainSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  legal_name: z.string().max(200).optional().or(z.literal('')),
})

export async function createSalonChain(formData: FormData) {
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
  try {
    // SECURITY: Business users only
    await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
    const id = formData.get('id')?.toString()
    if (!id || !UUID_REGEX.test(id)) return { error: 'Invalid ID' }

    const result = chainSchema.safeParse({
      name: formData.get('name'),
      legal_name: formData.get('legal_name'),
    })

    if (!result.success) return { error: result.error.issues[0]?.message ?? 'Validation failed' }

    const data = result.data
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return { error: 'Unauthorized' }

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

    if (updateError) return { error: updateError.message }

    revalidatePath('/admin/chains', 'page')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to update chain' }
  }
}

export async function deleteSalonChain(formData: FormData) {
  try {
    // SECURITY: Business users only
    await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
    const id = formData.get('id')?.toString()
    if (!id || !UUID_REGEX.test(id)) return { error: 'Invalid ID' }

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return { error: 'Unauthorized' }

    // Check if chain has salons
    const { count } = await supabase
      .from('salons_view')
      .select('*', { count: 'exact', head: true })
      .eq('chain_id', id)
      .is('deleted_at', null)

    if (count && count > 0) {
      return { error: `Cannot delete chain with ${count} active salon(s)` }
    }

    const { error: deleteError } = await supabase
      .schema('organization')
      .from('salon_chains')
      .update({
        deleted_at: new Date().toISOString(),
        updated_by_id: user['id'],
      })
      .eq('id', id)
      .eq('owner_id', user['id'])

    if (deleteError) return { error: deleteError.message }

    revalidatePath('/business/chains', 'page')
    revalidatePath('/admin/chains', 'page')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to delete chain' }
  }
}
