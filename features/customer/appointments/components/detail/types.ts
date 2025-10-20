import type { getCustomerAppointmentById, getAppointmentServices, getAppointmentProductUsage } from '../../api/queries'

export interface AppointmentDetailProps {
  appointmentId: string
}

export interface AppointmentDetailContentProps {
  appointment: Awaited<ReturnType<typeof getCustomerAppointmentById>>
  services: Awaited<ReturnType<typeof getAppointmentServices>>
  productUsage: Awaited<ReturnType<typeof getAppointmentProductUsage>>
}
