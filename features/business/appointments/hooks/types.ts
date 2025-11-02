import type { AppointmentServiceDetails } from '../api/queries'

export type ServiceOption = {
  id: string
  name: string
}

export type StaffOption = {
  id: string
  name: string
}

export type ServiceFormData = {
  serviceId?: string
  staffId: string
  startTime: string
  endTime: string
  durationMinutes: string
  status?: string
}

export { type AppointmentServiceDetails }
