import type { StaffWithServices } from '@/features/business/staff/api/queries'

export type AssignServicesDialogData = {
  staffId: string
  staffName: string
  currentServiceIds: string[]
}

export type ServiceOption = {
  id: string
  name: string
  categoryName?: string
}

export type StaffMemberWithServices = StaffWithServices
