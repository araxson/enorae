import type { Database } from '@/lib/types/database.types'
import type { SupabaseClient } from '@supabase/supabase-js'
import type {
  AppointmentSummary,
  ProductSummary,
  ProductUsageRow,
  ProductUsageWithDetails,
  StaffSummary,
} from './types'

type Client = SupabaseClient<Database>

const fetchProduct = async (supabase: Client, productId: string): Promise<ProductSummary | null> => {
  const { data } = await supabase.from('products').select('id, name, sku').eq('id', productId).single()
  return (data ?? null) as ProductSummary | null
}

const fetchAppointment = async (
  supabase: Client,
  appointmentId: string,
): Promise<AppointmentSummary | null> => {
  const { data } = await supabase.from('appointments').select('id, scheduled_at').eq('id', appointmentId).single()
  return (data ?? null) as AppointmentSummary | null
}

const fetchStaffProfile = async (supabase: Client, staffId: string): Promise<StaffSummary | null> => {
  const { data } = await supabase.from('profiles').select('id, full_name').eq('id', staffId).single()
  return (data ?? null) as StaffSummary | null
}

export const enrichUsageRecord = async (
  supabase: Client,
  usage: ProductUsageRow,
): Promise<ProductUsageWithDetails> => {
  const product = usage.product_id ? await fetchProduct(supabase, usage.product_id) : null

  const appointment = usage.appointment_id ? await fetchAppointment(supabase, usage.appointment_id) : null

  const staff = usage.performed_by_id ? await fetchStaffProfile(supabase, usage.performed_by_id) : null

  return {
    ...usage,
    product,
    appointment,
    staff,
  }
}

export const enrichUsageRecords = async (
  supabase: Client,
  usageRecords: ProductUsageRow[],
): Promise<ProductUsageWithDetails[]> => Promise.all(usageRecords.map((usage) => enrichUsageRecord(supabase, usage)))
