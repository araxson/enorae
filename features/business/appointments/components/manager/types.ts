import type { AppointmentServiceDetails } from '@/features/business/appointments/api/queries'

export interface AppointmentServicesManagerProps {
  appointmentId: string
  services: AppointmentServiceDetails[]
  onUpdate: () => void
  isLoading: boolean
}

export type { AppointmentServiceDetails }
