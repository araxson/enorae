import 'server-only'

import type { Database } from '@/lib/types/database.types'
import { getUserSalon } from '@/features/business/business-common/api/queries'
import { getStaffById, type EnrichedStaffProfile } from '@/features/business/staff/api/queries'
import { createClient } from '@/lib/supabase/server'

type StaffServiceRow = Database['public']['Views']['staff_services_view']['Row']
type ServiceRow = Database['public']['Views']['services_view']['Row']

export interface StaffWithServices extends EnrichedStaffProfile {
  services: StaffServiceRow[]
}

export class StaffServicesNotFoundError extends Error {
  constructor(message = 'Staff member not found') {
    super(message)
    this['name'] = 'StaffServicesNotFoundError'
  }
}

export interface StaffServicesData {
  staff: StaffWithServices
  availableServices: ServiceRow[]
}

function buildStaffWithServices(
  staff: EnrichedStaffProfile,
  services: StaffServiceRow[],
): StaffWithServices {
  return {
    ...staff,
    services,
  }
}

async function getStaffServices(staffId: string): Promise<StaffServiceRow[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('staff_services_view')
    .select('*')
    .eq('staff_id', staffId)
    .returns<StaffServiceRow[]>()

  if (error) throw error
  return data ?? []
}

async function getAvailableServices(salonId: string): Promise<ServiceRow[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('services_view')
    .select('*')
    .eq('salon_id', salonId)
    .returns<ServiceRow[]>()

  if (error) throw error
  return data ?? []
}

export async function getStaffServicesData(
  staffId: string,
): Promise<StaffServicesData> {
  const staff = await getStaffById(staffId)

  if (!staff || !staff.id) {
    throw new StaffServicesNotFoundError()
  }

  const [assignedServices, salon] = await Promise.all([
    getStaffServices(staff.id),
    getUserSalon(),
  ])

  const availableServices = await getAvailableServices(salon.id!)

  return {
    staff: buildStaffWithServices(staff, assignedServices),
    availableServices,
  }
}
