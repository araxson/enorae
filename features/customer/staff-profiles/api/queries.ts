import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { verifySession } from '@/lib/auth/session'
import type { Database } from '@/lib/types/database.types'

type Staff = Database['public']['Views']['staff']['Row']
type Service = Database['public']['Views']['services']['Row']

export type StaffProfile = Staff & {
  services?: Service[]
  // TODO: Add these fields to the staff view
  average_rating?: number | null
  review_count?: number | null
  specialties?: string[] | null
  certifications?: string[] | null
}

/**
 * Get staff member profile by ID
 */
export async function getStaffProfile(staffId: string): Promise<StaffProfile | null> {
  const session = await verifySession()
  if (!session) throw new Error('Unauthorized')

  const supabase = await createClient()

  const { data: staff, error: staffError } = await supabase
    .from('staff')
    .select('*')
    .eq('id', staffId)
    .eq('status', 'active')
    .is('deleted_at', null)
    .maybeSingle()

  if (staffError) {
    if (staffError.code === 'PGRST116') return null
    throw staffError
  }

  if (!staff) return null

  // Get services offered by this staff member via staff_services junction table
  const { data: staffServices, error: servicesError } = await supabase
    .from('staff_services')
    .select('service:service_id(*)')
    .eq('staff_id', staffId)

  if (servicesError) throw servicesError

  // Extract services from the nested structure
  const services = (staffServices || [])
    .map((ss: { service: Service | null }) => ss.service)
    .filter((s): s is Service => s !== null && s.is_active === true)

  return {
    ...(staff as Staff),
    services,
  } as StaffProfile
}

/**
 * Get all active staff members for a salon
 */
export async function getSalonStaff(salonId: string): Promise<Staff[]> {
  const session = await verifySession()
  if (!session) throw new Error('Unauthorized')

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('staff')
    .select('*')
    .eq('salon_id', salonId)
    .eq('status', 'active')
    .is('deleted_at', null)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data || []
}