import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

type StaffService = Database['public']['Views']['staff_services']['Row']
type Service = Database['public']['Views']['services']['Row']
type Staff = Database['public']['Views']['staff_profiles_view']['Row']
type Salon = Database['public']['Views']['salons']['Row']

export type StaffWithServices = {
  id: string
  full_name: string | null
  email: string | null
  title: string | null
  avatar_url: string | null
  bio: string | null
  experience_years: number | null
  status: string | null
  services: StaffService[]
}

/**
 * Get all staff members with their assigned services
 */
export async function getStaffWithServices(salonId: string): Promise<StaffWithServices[]> {
  // SECURITY: Require business role
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()

  // Get all staff for salon
  const { data: staff, error: staffError } = await supabase
    .from('staff_profiles_view')
    .select('*')
    .eq('salon_id', salonId)
    .order('full_name')

  if (staffError) throw staffError

  // Get all staff services for this salon
  const staffIds =
    staff?.map((s) => (s as Staff)['id']!).filter((id): id is string => id !== null) || []

  if (staffIds.length === 0) {
    return []
  }

  const { data: staffServices, error: servicesError } = await supabase
    .from('staff_services')
    .select('*')
    .in('staff_id', staffIds)

  if (servicesError) throw servicesError

  // Group services by staff
  const staffWithServices: StaffWithServices[] = (staff || [])
    .filter((member): member is typeof member & { id: string } => (member as Staff)['id'] !== null)
    .map((member) => {
      const staffMember = member as Staff
      return {
        id: staffMember['id']!,
        full_name: staffMember['full_name'],
        email: staffMember['email'],
        title: staffMember['title'],
        avatar_url: staffMember['avatar_url'],
        bio: staffMember['bio'],
        experience_years: staffMember['experience_years'],
        status: staffMember['status'],
        services: (staffServices || []).filter(
          (service) => (service as StaffService)['staff_id'] === staffMember['id']
        ),
      }
    })

  return staffWithServices
}

/**
 * Get available services for a salon (for assignment)
 */
export async function getAvailableServices(salonId: string): Promise<Service[]> {
  // SECURITY: Require business role
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('salon_id', salonId)
    .eq('is_active', true)
    .is('deleted_at', null)
    .order('name')

  if (error) throw error
  return data as Service[]
}

/**
 * Get services assigned to a specific staff member
 */
export async function getStaffServices(staffId: string): Promise<StaffService[]> {
  // SECURITY: Require business role
  const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()

  // Verify staff belongs to user's salon
  const { data: salon } = await supabase
    .from('salons')
    .select('*')
    .eq('owner_id', session.user['id'])
    .single()

  if (!salon) throw new Error('Salon not found')

  const { data: staff } = await supabase
    .from('staff_profiles_view')
    .select('*')
    .eq('id', staffId)
    .single()

  if (!staff || (staff as Staff)['salon_id'] !== (salon as Salon)['id']) {
    throw new Error('Unauthorized')
  }

  const { data, error } = await supabase
    .from('staff_services')
    .select('*')
    .eq('staff_id', staffId)
    .order('service_name', { ascending: true })

  if (error) throw error
  return data || []
}
