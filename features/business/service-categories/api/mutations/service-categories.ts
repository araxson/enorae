'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { categorySchema } from '@/features/business/service-categories/api/schema'
import { createOperationLogger, logMutation, logError } from '@/lib/observability'

// Note: .schema() required for INSERT/UPDATE/DELETE since views are read-only

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

type CategoryFormState = {
  success?: boolean
  error?: string
  errors?: Record<string, string[]>
}

// useActionState signature: (prevState, formData) => Promise<state>
export async function createServiceCategory(
  prevState: CategoryFormState | null,
  formData: FormData
): Promise<CategoryFormState> {
  const logger = createOperationLogger('createServiceCategory', {})
  logger.start()

  try {
    const parentIdValue = formData.get('parentId')?.toString()
    const result = categorySchema.safeParse({
      name: formData.get('name'),
      parentId: parentIdValue && parentIdValue !== '' ? parentIdValue : null,
    })

    if (!result.success) {
      return {
        error: 'Validation failed',
        errors: result.error.flatten().fieldErrors,
      }
    }

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

    /**
     * Service Category Schema Enhancement
     *
     * The catalog.service_categories table currently supports basic category information.
     * Future enhancements pending database migration:
     *
     * Additional Fields (planned):
     * - description: text - Detailed category description for customer display
     * - display_order: integer - Sort order for category listing (default: 0)
     * - icon_name: varchar(50) - Icon identifier for UI rendering
     *
     * These fields will enable:
     * - Richer category presentation in customer-facing interfaces
     * - Customizable category ordering for business owners
     * - Visual category distinction with icon support
     */
    const { error: insertError } = await supabase
      .schema('catalog')
      .from('service_categories')
      .insert({
        salon_id: staffProfile.salon_id,
        parent_id: data.parentId || null,
        name: data.name,
        slug,
        created_by_id: user.id,
        updated_by_id: user.id,
      })

    if (insertError) return { error: insertError.message }

    revalidatePath('/business/services/categories', 'page')
    revalidatePath('/business/service-categories')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to create category' }
  }
}

// useActionState signature: (prevState, formData) => Promise<state>
export async function updateServiceCategory(
  prevState: CategoryFormState | null,
  formData: FormData
): Promise<CategoryFormState> {
  try {
    const id = formData.get('id')?.toString()
    if (!id || !UUID_REGEX.test(id)) return { error: 'Invalid ID' }

    const parentIdValue = formData.get('parentId')?.toString()
    const result = categorySchema.safeParse({
      name: formData.get('name'),
      parentId: parentIdValue && parentIdValue !== '' ? parentIdValue : null,
    })

    if (!result.success) {
      return {
        error: 'Validation failed',
        errors: result.error.flatten().fieldErrors,
      }
    }

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

    /**
     * Service Category Update
     *
     * Currently updates basic category fields. Additional fields (description,
     * display_order, icon_name) will be included once database schema is enhanced.
     * See createServiceCategory for schema enhancement documentation.
     */
    const { error: updateError } = await supabase
      .schema('catalog')
      .from('service_categories')
      .update({
        parent_id: data.parentId || null,
        name: data.name,
        updated_by_id: user.id,
      })
      .eq('id', id)
      .eq('salon_id', staffProfile.salon_id)

    if (updateError) return { error: updateError.message }

    revalidatePath('/business/services/categories', 'page')
    revalidatePath('/business/service-categories')
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
