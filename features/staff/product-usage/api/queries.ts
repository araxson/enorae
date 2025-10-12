import 'server-only'
import { verifySession } from '@/lib/auth/session'
import { createClient } from '@/lib/supabase/server'
import type { ProductUsage, Product } from '../types'

export async function getMyProductUsage(): Promise<ProductUsage[]> {
  const session = await verifySession()
  if (!session) throw new Error('Unauthorized')

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('product_usage')
    .select('*')
    .eq('performed_by_id', session.user.id)
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) throw error
  return data
}

export async function getProductsByAppointment(appointmentId: string): Promise<ProductUsage[]> {
  const session = await verifySession()
  if (!session) throw new Error('Unauthorized')

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('product_usage')
    .select('*')
    .eq('appointment_id', appointmentId)
    .eq('performed_by_id', session.user.id)

  if (error) throw error
  return data
}

export async function getAvailableProducts(): Promise<Product[]> {
  const session = await verifySession()
  if (!session) throw new Error('Unauthorized')

  const supabase = await createClient()

  // Get user's salon_id
  const { data: staffData, error: staffError } = await supabase
    .from('staff')
    .select('salon_id')
    .eq('user_id', session.user.id)
    .single<{ salon_id: string }>()

  if (staffError || !staffData?.salon_id) throw new Error('Staff record not found')

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('salon_id', staffData.salon_id)
    .eq('is_active', true)
    .order('name', { ascending: true })

  if (error) throw error
  return data
}

export async function getProductStock(productId: string, locationId: string) {
  const session = await verifySession()
  if (!session) throw new Error('Unauthorized')

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('stock_levels')
    .select('quantity_on_hand, quantity_available')
    .eq('product_id', productId)
    .eq('location_id', locationId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data
}