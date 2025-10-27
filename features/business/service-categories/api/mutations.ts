'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

// Note: .schema() required for INSERT/UPDATE/DELETE since views are read-only


const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  parentId: z.string().uuid().optional().nullable(),
  description: z.string().max(500).optional().or(z.literal('')),
  displayOrder: z.number().int().min(0).optional(),
  iconName: z.string().max(50).optional().or(z.literal('')),
})

export async function createServiceCategory(formData: FormData) {
  try {
    const parentIdValue = formData.get('parentId')?.toString()
    const result = categorySchema.safeParse({
      name: formData.get('name'),
      parentId: parentIdValue && parentIdValue !== '' ? parentIdValue : null,
      description: formData.get('description'),
      displayOrder: formData.get('displayOrder') ? parseInt(formData.get('displayOrder') as string) : undefined,
      iconName: formData.get('iconName'),
    })

    if (!result.success) return { error: result.error.issues[0]?.message ?? 'Validation failed' }

    const data = result.data
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return { error: 'Unauthorized' }

    const { data: staffProfile } = await supabase
      .from('staff_profiles_view')
      .select('salon_id')
      .eq('user_id', user.id)
      .single<{ salon_id: string | null }>()

    if (!staffProfile?.salon_id) return { error: 'User salon not found' }

    // Generate slug from name
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    const { error: insertError } = await supabase
      .schema('catalog')
      .from('service_categories')
      .insert({
        salon_id: staffProfile.salon_id,
        parent_id: data.parentId || null,
        name: data.name,
        slug,
        // TODO: Add description field to database schema
        // TODO: Add display_order field to database schema
        // TODO: Add icon_name field to database schema
        created_by_id: user.id,
        updated_by_id: user.id,
      })

    if (insertError) return { error: insertError.message }

    revalidatePath('/business/services/categories', 'page')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to create category' }
  }
}

export async function updateServiceCategory(formData: FormData) {
  try {
    const id = formData.get('id')?.toString()
    if (!id || !UUID_REGEX.test(id)) return { error: 'Invalid ID' }

    const parentIdValue = formData.get('parentId')?.toString()
    const result = categorySchema.safeParse({
      name: formData.get('name'),
      parentId: parentIdValue && parentIdValue !== '' ? parentIdValue : null,
      description: formData.get('description'),
      displayOrder: formData.get('displayOrder') ? parseInt(formData.get('displayOrder') as string) : undefined,
      iconName: formData.get('iconName'),
    })

    if (!result.success) return { error: result.error.issues[0]?.message ?? 'Validation failed' }

    const data = result.data
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return { error: 'Unauthorized' }

    const { data: staffProfile } = await supabase
      .from('staff_profiles_view')
      .select('salon_id')
      .eq('user_id', user.id)
      .single<{ salon_id: string | null }>()

    if (!staffProfile?.salon_id) return { error: 'User salon not found' }

    // Prevent setting self as parent (would create circular reference)
    if (data.parentId === id) {
      return { error: 'Category cannot be its own parent' }
    }

    const { error: updateError } = await supabase
      .schema('catalog')
      .from('service_categories')
      .update({
        parent_id: data.parentId || null,
        name: data.name,
        // TODO: Add description field to database schema
        // TODO: Add display_order field to database schema
        // TODO: Add icon_name field to database schema
        updated_by_id: user.id,
      })
      .eq('id', id)
      .eq('salon_id', staffProfile.salon_id)

    if (updateError) return { error: updateError.message }

    revalidatePath('/business/services/categories', 'page')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to update category' }
  }
}

export async function deleteServiceCategory(formData: FormData) {
  try {
    const id = formData.get('id')?.toString()
    if (!id || !UUID_REGEX.test(id)) return { error: 'Invalid ID' }

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return { error: 'Unauthorized' }

    const { data: staffProfile } = await supabase
      .from('staff_profiles_view')
      .select('salon_id')
      .eq('user_id', user.id)
      .single<{ salon_id: string | null }>()

    if (!staffProfile?.salon_id) return { error: 'User salon not found' }

    // Check if category has services
    const { count } = await supabase
      .from('services_view')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', id)
      .is('deleted_at', null)

    if (count && count > 0) {
      return { error: `Cannot delete category with ${count} active service(s)` }
    }

    const { error: deleteError } = await supabase
      .schema('catalog')
      .from('service_categories')
      .update({
        deleted_at: new Date().toISOString(),
        updated_by_id: user.id,
      })
      .eq('id', id)
      .eq('salon_id', staffProfile.salon_id)

    if (deleteError) return { error: deleteError.message }

    revalidatePath('/business/services/categories', 'page')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to delete category' }
  }
}
