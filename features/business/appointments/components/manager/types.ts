import type { AppointmentServiceDetails } from '../../api/queries/appointment-services'

export interface AppointmentServicesManagerProps {
  appointmentId: string
  services: AppointmentServiceDetails[]
  onUpdate: () => void
  isLoading: boolean
}

export type { AppointmentServiceDetails }
