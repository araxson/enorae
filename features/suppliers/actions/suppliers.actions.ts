'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

// Note: suppliers and staff_profiles don't have public views yet
// Keeping .schema() calls until public views are created for inventory tables

// UUID validation
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// Validation schemas
const createSupplierSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  contactName: z.string().max(200).optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().max(50).optional(),
  address: z.string().max(500).optional(),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  paymentTerms: z.string().max(500).optional(),
  notes: z.string().max(2000).optional(),
  isActive: z.boolean().optional(),
})

const updateSupplierSchema = createSupplierSchema.extend({
  id: z.string().regex(UUID_REGEX, 'Invalid supplier ID format'),
})

const deleteSupplierSchema = z.object({
  id: z.string().regex(UUID_REGEX, 'Invalid supplier ID format'),
})

/**
 * Create a new supplier
 */
export async function createSupplier(formData: FormData) {
  try {
    // Validate input
    const result = createSupplierSchema.safeParse({
      name: formData.get('name'),
      contactName: formData.get('contactName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      address: formData.get('address'),
      website: formData.get('website'),
      paymentTerms: formData.get('paymentTerms'),
      notes: formData.get('notes'),
      isActive: formData.get('isActive') === 'true',
    })

    if (!result.success) {
      return {
        error: result.error.errors[0].message,
      }
    }

    const data = result.data

    // Create Supabase client
    const supabase = await createClient()

    // Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { error: 'Unauthorized' }
    }

    // Get user's salon_id from staff_profiles
    const { data: staffProfile } = await supabase
      .schema('organization')
      .from('staff_profiles')
      .select('salon_id')
      .eq('user_id', user.id)
      .single()

    if (!staffProfile?.salon_id) {
      return { error: 'User salon not found' }
    }

    // Create supplier
    const { error: insertError } = await supabase
      .schema('inventory')
      .from('suppliers')
      .insert({
        name: data.name,
        contact_name: data.contactName || null,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address || null,
        website: data.website || null,
        payment_terms: data.paymentTerms || null,
        notes: data.notes || null,
        is_active: data.isActive ?? true,
        salon_id: staffProfile.salon_id,
        created_by_id: user.id,
        updated_by_id: user.id,
      })

    if (insertError) {
      return { error: insertError.message }
    }

    // Revalidate paths
    revalidatePath('/business/inventory/suppliers')
    revalidatePath('/business/inventory')

    return { success: true }
  } catch (error) {
    console.error('Error creating supplier:', error)
    return {
      error: error instanceof Error ? error.message : 'Failed to create supplier',
    }
  }
}

/**
 * Update an existing supplier
 */
export async function updateSupplier(formData: FormData) {
  try {
    // Validate input
    const result = updateSupplierSchema.safeParse({
      id: formData.get('id'),
      name: formData.get('name'),
      contactName: formData.get('contactName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      address: formData.get('address'),
      website: formData.get('website'),
      paymentTerms: formData.get('paymentTerms'),
      notes: formData.get('notes'),
      isActive: formData.get('isActive') === 'true',
    })

    if (!result.success) {
      return {
        error: result.error.errors[0].message,
      }
    }

    const { id, ...data } = result.data

    // Create Supabase client
    const supabase = await createClient()

    // Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { error: 'Unauthorized' }
    }

    // Get user's salon_id from staff_profiles
    const { data: staffProfile } = await supabase
      .schema('organization')
      .from('staff_profiles')
      .select('salon_id')
      .eq('user_id', user.id)
      .single()

    if (!staffProfile?.salon_id) {
      return { error: 'User salon not found' }
    }

    // Verify ownership
    const { data: existingSupplier } = await supabase
      .schema('inventory')
      .from('suppliers')
      .select('salon_id')
      .eq('id', id)
      .single()

    if (existingSupplier?.salon_id !== staffProfile.salon_id) {
      return { error: 'Unauthorized: Supplier not found for your salon' }
    }

    // Update supplier
    const { error: updateError } = await supabase
      .schema('inventory')
      .from('suppliers')
      .update({
        name: data.name,
        contact_name: data.contactName || null,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address || null,
        website: data.website || null,
        payment_terms: data.paymentTerms || null,
        notes: data.notes || null,
        is_active: data.isActive ?? true,
        updated_by_id: user.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('salon_id', staffProfile.salon_id)

    if (updateError) {
      return { error: updateError.message }
    }

    // Revalidate paths
    revalidatePath('/business/inventory/suppliers')
    revalidatePath('/business/inventory')

    return { success: true }
  } catch (error) {
    console.error('Error updating supplier:', error)
    return {
      error: error instanceof Error ? error.message : 'Failed to update supplier',
    }
  }
}

/**
 * Delete a supplier (soft delete by setting is_active to false)
 */
export async function deleteSupplier(formData: FormData) {
  try {
    // Validate input
    const result = deleteSupplierSchema.safeParse({
      id: formData.get('id'),
    })

    if (!result.success) {
      return {
        error: result.error.errors[0].message,
      }
    }

    const { id } = result.data

    // Create Supabase client
    const supabase = await createClient()

    // Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { error: 'Unauthorized' }
    }

    // Get user's salon_id from staff_profiles
    const { data: staffProfile } = await supabase
      .schema('organization')
      .from('staff_profiles')
      .select('salon_id')
      .eq('user_id', user.id)
      .single()

    if (!staffProfile?.salon_id) {
      return { error: 'User salon not found' }
    }

    // Verify ownership
    const { data: existingSupplier } = await supabase
      .schema('inventory')
      .from('suppliers')
      .select('salon_id')
      .eq('id', id)
      .single()

    if (existingSupplier?.salon_id !== staffProfile.salon_id) {
      return { error: 'Unauthorized: Supplier not found for your salon' }
    }

    // Soft delete (set is_active to false)
    const { error: updateError } = await supabase
      .schema('inventory')
      .from('suppliers')
      .update({
        is_active: false,
        updated_by_id: user.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('salon_id', staffProfile.salon_id)

    if (updateError) {
      return { error: updateError.message }
    }

    // Revalidate paths
    revalidatePath('/business/inventory/suppliers')
    revalidatePath('/business/inventory')

    return { success: true }
  } catch (error) {
    console.error('Error deleting supplier:', error)
    return {
      error: error instanceof Error ? error.message : 'Failed to delete supplier',
    }
  }
}
