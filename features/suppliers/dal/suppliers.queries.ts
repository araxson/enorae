import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

// Types - Use Views not Tables
type Supplier = Database['public']['Views']['suppliers']['Row']

/**
 * Get all suppliers for the user's salon
 */
export async function getSuppliers(): Promise<Supplier[]> {
  const supabase = await createClient()

  // Auth check
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Unauthorized')

  // Get user's salon_id from staff view
  const { data: staffProfile } = await supabase
    .from('staff')
    .select('salon_id')
    .eq('user_id', user.id)
    .single()

  if (!staffProfile?.salon_id) throw new Error('User salon not found')

  // Query suppliers from public view
  const { data, error } = await supabase
    .from('suppliers')
    .select('*')
    .eq('salon_id', staffProfile.salon_id)
    .order('name', { ascending: true })

  if (error) throw error
  return data
}

/**
 * Get active suppliers for the user's salon
 */
export async function getActiveSuppliers(): Promise<Supplier[]> {
  const supabase = await createClient()

  // Auth check
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Unauthorized')

  // Get user's salon_id from staff view
  const { data: staffProfile } = await supabase
    .from('staff')
    .select('salon_id')
    .eq('user_id', user.id)
    .single()

  if (!staffProfile?.salon_id) throw new Error('User salon not found')

  // Query active suppliers from public view
  const { data, error } = await supabase
    .from('suppliers')
    .select('*')
    .eq('salon_id', staffProfile.salon_id)
    .eq('is_active', true)
    .order('name', { ascending: true })

  if (error) throw error
  return data
}

/**
 * Get single supplier by ID
 */
export async function getSupplierById(id: string): Promise<Supplier | null> {
  const supabase = await createClient()

  // Auth check
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Unauthorized')

  // Get user's salon_id from staff view
  const { data: staffProfile } = await supabase
    .from('staff')
    .select('salon_id')
    .eq('user_id', user.id)
    .single()

  if (!staffProfile?.salon_id) throw new Error('User salon not found')

  // Query single supplier from public view
  const { data, error } = await supabase
    .from('suppliers')
    .select('*')
    .eq('id', id)
    .eq('salon_id', staffProfile.salon_id)
    .single()

  if (error) throw error
  return data
}
