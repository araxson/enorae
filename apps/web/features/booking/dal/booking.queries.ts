import { createClient } from '@/lib/supabase/client'
import type { Service, Staff } from '../types/booking.types'

export async function getBookingServices(salonId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('salon_id', salonId)
    .eq('is_bookable', true)
    .eq('is_active', true)
    .order('name')

  if (error) throw error
  return data as Service[]
}

export async function getBookingStaff(salonId: string, serviceId?: string) {
  const supabase = await createClient()

  let query = supabase
    .from('staff')
    .select('*')
    .eq('salon_id', salonId)
    .is('deleted_at', null)

  // If serviceId provided, filter staff who can perform this service
  if (serviceId) {
    // Note: This would need a join with staff_services table
    // For MVP, we'll return all staff
  }

  const { data, error } = await query.order('title')

  if (error) throw error
  return data as Staff[]
}

export async function getAvailableSlots(
  salonId: string,
  staffId: string,
  date: string
) {
  // For MVP, generate simple time slots
  // In production, this would check appointments and staff schedules
  const slots = []
  for (let hour = 9; hour <= 17; hour++) {
    slots.push({
      time: `${hour.toString().padStart(2, '0')}:00`,
      available: true,
      staffId,
    })
  }
  return slots
}