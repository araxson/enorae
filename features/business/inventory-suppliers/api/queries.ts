import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, requireUserSalonId, canAccessSalon, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

// COMPLIANCE: Use public view types for SELECTs
type Supplier = Database['public']['Views']['suppliers']['Row']

/**
 * Get all suppliers for the user's salon
 */
export async function getSuppliers(): Promise<Supplier[]> {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()
  const supabase = await createClient()

  // Query suppliers from public view
  const { data, error } = await supabase
    .from('suppliers')
    .select('*')
    .eq('salon_id', salonId)
    .order('name', { ascending: true })

  if (error) throw error
  return data
}

/**
 * Get active suppliers for the user's salon
 */
export async function getActiveSuppliers(): Promise<Supplier[]> {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()
  const supabase = await createClient()

  // Query active suppliers from public view
  const { data, error } = await supabase
    .from('suppliers')
    .select('*')
    .eq('salon_id', salonId)
    .eq('is_active', true)
    .order('name', { ascending: true })

  if (error) throw error
  return data
}

/**
 * Get single supplier by ID
 */
export async function getSupplierById(id: string): Promise<Supplier | null> {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const supabase = await createClient()

  // Query single supplier from public view
  const { data, error } = await supabase
    .from('suppliers')
    .select('*')
    .eq('id', id)
    .single<Supplier>()

  if (error) throw error
  if (!data?.salon_id) {
    throw new Error('Supplier not found')
  }
  if (!(await canAccessSalon(data.salon_id))) {
    throw new Error('Supplier not found')
  }
  return data
}