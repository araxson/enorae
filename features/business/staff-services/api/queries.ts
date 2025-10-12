import 'server-only'

import type { Database } from '@/lib/types/database.types'
import { getUserSalon } from '@/features/business/business-common/api/queries'
import {
  getStaffById,
  getAvailableServices,
  getStaffServices,
  type StaffWithServices,
} from '@/features/business/staff/api/queries'

type StaffRow = Database['public']['Views']['staff']['Row']
type StaffServiceRow = Database['public']['Views']['staff_services']['Row']
type ServiceRow = Database['public']['Views']['services']['Row']

export class StaffServicesNotFoundError extends Error {
  constructor(message = 'Staff member not found') {
    super(message)
    this.name = 'StaffServicesNotFoundError'
  }
}

export interface StaffServicesData {
  staff: StaffWithServices
  availableServices: ServiceRow[]
}

function buildStaffWithServices(
  staff: StaffRow,
  services: StaffServiceRow[],
): StaffWithServices {
  return {
    id: staff.id!,
    full_name: staff.full_name,
    email: staff.email,
    title: staff.title,
    avatar_url: staff.avatar_url,
    bio: staff.bio,
    experience_years: staff.experience_years,
    status: staff.status,
    services,
  }
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
    staff: buildStaffWithServices(staff as StaffRow, assignedServices),
    availableServices,
  }
}
