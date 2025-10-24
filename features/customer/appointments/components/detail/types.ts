import type { getCustomerAppointmentById, getAppointmentServices } from '@/features/customer/appointments/api/queries'

export interface AppointmentDetailProps {
  appointmentId: string
}

export interface AppointmentDetailContentProps {
  appointment: Awaited<ReturnType<typeof getCustomerAppointmentById>>
  services: Awaited<ReturnType<typeof getAppointmentServices>>
}
