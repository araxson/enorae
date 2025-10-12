import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

type Appointment = Database['public']['Views']['appointments']['Row']
type AppointmentService = Database['public']['Views']['appointment_services']['Row']
type ProductUsage = Database['public']['Views']['product_usage']['Row']
type ProductUsageWithProduct = ProductUsage & {
  product: {
    name: string | null
    description: string | null
    unit_of_measure: string | null
  } | null
}

export type ProductUsageWithDetails = ProductUsage & {
  product_name: string | null
  product_description: string | null
  unit_of_measure: string | null
}

export async function getCustomerAppointments(): Promise<Appointment[]> {
  const session = await requireAuth()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('customer_id', session.user.id)
    .order('start_time', { ascending: false })

  if (error) throw error
  return data || []
}

export async function getCustomerAppointmentById(id: string): Promise<Appointment | null> {
  const session = await requireAuth()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('id', id)
    .eq('customer_id', session.user.id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }

  return data
}

export async function getAppointmentServices(appointmentId: string): Promise<AppointmentService[]> {
  const session = await requireAuth()
  const supabase = await createClient()

  // First verify the appointment belongs to this customer
  const { data: appointment } = await supabase
    .from('appointments')
    .select('*')
    .eq('id', appointmentId)
    .single()

  if (!appointment || (appointment as Appointment).customer_id !== session.user.id) {
    throw new Error('Unauthorized')
  }

  const { data, error } = await supabase
    .from('appointment_services')
    .select('*')
    .eq('appointment_id', appointmentId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data || []
}

export async function getAppointmentProductUsage(appointmentId: string): Promise<ProductUsageWithDetails[]> {
  const session = await requireAuth()
  const supabase = await createClient()

  // First verify the appointment belongs to this customer
  const { data: appointment } = await supabase
    .from('appointments')
    .select('customer_id')
    .eq('id', appointmentId)
    .single()

  if (!appointment || (appointment as { customer_id: string | null }).customer_id !== session.user.id) {
    throw new Error('Unauthorized')
  }

  // Get product usage with product details
  const { data, error } = await supabase
    .from('product_usage')
    .select(`
      *,
      product:product_id (
        name,
        description,
        unit_of_measure
      )
    `)
    .eq('appointment_id', appointmentId)
    .order('created_at', { ascending: true })

  if (error) throw error

  // Transform the data to flatten the product details
  const transformedData = (data || []).map((item: ProductUsageWithProduct) => ({
    ...item,
    product_name: item.product?.name || null,
    product_description: item.product?.description || null,
    unit_of_measure: item.product?.unit_of_measure || null,
  }))

  return transformedData as ProductUsageWithDetails[]
}