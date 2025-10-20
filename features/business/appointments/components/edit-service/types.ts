import type { AppointmentServiceDetails } from '../../api/queries/appointment-services'

export interface EditServiceDialogProps {
  service: AppointmentServiceDetails
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export type StaffOption = {
  id: string
  name: string
}

export type ServiceFormData = {
  staffId: string
  startTime: string
  endTime: string
  durationMinutes: string
  status: string
}
