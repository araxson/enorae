export interface AddServiceDialogProps {
  appointmentId: string
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export type ServiceOption = {
  id: string
  name: string
}

export type StaffOption = {
  id: string
  name: string
}

export type ServiceFormData = {
  serviceId: string
  staffId: string
  startTime: string
  endTime: string
  durationMinutes: string
}
