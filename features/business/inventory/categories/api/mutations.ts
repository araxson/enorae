'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'

// Note: .schema() required for INSERT/UPDATE/DELETE since views are read-only

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().max(500).optional().or(z.literal('')),
  displayOrder: z.number().int().min(0).optional(),
})

export async function createProductCategory(formData: FormData) {
  try {
    const result = categorySchema.safeParse({
      name: formData.get('name'),
      description: formData.get('description'),
      displayOrder: formData.get('displayOrder') ? parseInt(formData.get('displayOrder') as string) : undefined,
    })

    if (!result.success) return { error: result.error.errors[0].message }

    const data = result.data
    const supabase = await createClient()
    // SECURITY: Require authentication
    const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

    const { data: staffProfile } = await supabase
      .from('staff')
      .select('salon_id')
      .eq('user_id', session.user.id)
      .single<{ salon_id: string }>()

    if (!staffProfile?.salon_id) return { error: 'User salon not found' }

    const { error: insertError } = await supabase
      .schema('inventory')
      .from('product_categories')
      .insert({
        salon_id: staffProfile.salon_id,
        name: data.name,
        description: data.description || null,
        display_order: data.displayOrder || null,
        created_by_id: session.user.id,
        updated_by_id: session.user.id,
      })

    if (insertError) return { error: insertError.message }

    revalidatePath('/business/inventory/categories')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to create category' }
  }
}

export async function updateProductCategory(formData: FormData) {
  try {
    const id = formData.get('id')?.toString()
    if (!id || !UUID_REGEX.test(id)) return { error: 'Invalid ID' }

    const result = categorySchema.safeParse({
      name: formData.get('name'),
      description: formData.get('description'),
      displayOrder: formData.get('displayOrder') ? parseInt(formData.get('displayOrder') as string) : undefined,
    })

    if (!result.success) return { error: result.error.errors[0].message }

    const data = result.data
    const supabase = await createClient()
    // SECURITY: Require authentication
    const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

    const { data: staffProfile } = await supabase
      .from('staff')
      .select('salon_id')
      .eq('user_id', session.user.id)
      .single<{ salon_id: string }>()

    if (!staffProfile?.salon_id) return { error: 'User salon not found' }

    const { error: updateError } = await supabase
      .schema('inventory')
      .from('product_categories')
      .update({
        name: data.name,
        description: data.description || null,
        display_order: data.displayOrder || null,
        updated_by_id: session.user.id,
      })
      .eq('id', id)
      .eq('salon_id', staffProfile.salon_id)

    if (updateError) return { error: updateError.message }

    revalidatePath('/business/inventory/categories')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to update category' }
  }
}

export async function deleteProductCategory(formData: FormData) {
  try {
    const id = formData.get('id')?.toString()
    if (!id || !UUID_REGEX.test(id)) return { error: 'Invalid ID' }

    const supabase = await createClient()
    // SECURITY: Require authentication
    const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

    const { data: staffProfile } = await supabase
      .from('staff')
      .select('salon_id')
      .eq('user_id', session.user.id)
      .single<{ salon_id: string }>()

    if (!staffProfile?.salon_id) return { error: 'User salon not found' }

    // Check if category has products
    const { count } = await supabase
      .schema('inventory')
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', id)
      .is('deleted_at', null)

    if (count && count > 0) {
      return { error: `Cannot delete category with ${count} active product(s)` }
    }

    const { error: deleteError } = await supabase
      .schema('inventory')
      .from('product_categories')
      .update({
        deleted_at: new Date().toISOString(),
        updated_by_id: session.user.id,
      })
      .eq('id', id)
      .eq('salon_id', staffProfile.salon_id)

    if (deleteError) return { error: deleteError.message }

    revalidatePath('/business/inventory/categories')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to delete category' }
  }
}
