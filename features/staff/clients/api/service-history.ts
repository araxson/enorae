import 'server-only'
import { requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import type { Appointment, ClientServiceHistory } from './clients-types'

export async function getClientServiceHistory(staffId: string, customerId: string): Promise<ClientServiceHistory[]> {
  const session = await requireAuth()
  const supabase = await createClient()

  // Security check
  const { data: staffProfile } = await supabase
    .from('staff_profiles_view')
    .select('id')
    .eq('user_id', session.user.id)
    .eq('id', staffId)
    .single()

  if (!staffProfile) throw new Error('Unauthorized')

  const { data: appointments } = await supabase
    .from('appointments_view')
    .select('*')
    .eq('staff_id', staffId)
    .eq('customer_id', customerId)
    .eq('status', 'completed')

  if (!appointments) return []

  // Note: appointments_view doesn't have service information
  // This function cannot work properly without access to service data
  // Would need to query appointment_services table instead
  return []
}
