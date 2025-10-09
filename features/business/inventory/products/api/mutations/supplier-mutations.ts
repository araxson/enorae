'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, canAccessSalon, ROLE_GROUPS } from '@/lib/auth'

import { UUID_REGEX, type ActionResult } from './helpers'

const supplierSchema = z.object({
  name: z.string().min(1, 'Supplier name is required'),
  contact_name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
  is_active: z.boolean().default(true),
})

export async function createSupplier(
  salonId: string,
  data: z.infer<typeof supplierSchema>,
): Promise<ActionResult> {
  try {
    if (!UUID_REGEX.test(salonId)) {
      return { error: 'Invalid salon ID format' }
    }

    const validated = supplierSchema.parse(data)
    const supabase = await createClient()
    const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

    if (!session.user) return { error: 'Unauthorized' }
    if (!(await canAccessSalon(salonId))) {
      return { error: 'Unauthorized: Not your salon' }
    }

    const { data: supplier, error } = await supabase
      .schema('inventory')
      .from('suppliers')
      .insert({
        ...validated,
        salon_id: salonId,
        created_by_id: session.user.id,
        updated_by_id: session.user.id,
      })
      .select()
      .single()

    if (error) throw error

    revalidatePath('/business/inventory')
    return { success: true, data: supplier }
  } catch (error) {
    console.error('Error creating supplier:', error)
    return {
      error: error instanceof Error ? error.message : 'Failed to create supplier',
    }
  }
}
