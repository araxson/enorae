import type { Metadata } from 'next'
import { AppointmentDetail } from '@/features/customer/appointments/components/appointment-detail'

export const metadata: Metadata = {
  title: 'Appointment Details - ENORAE',
  description: 'View your appointment details and booking information',
}

export default async function AppointmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <AppointmentDetail appointmentId={id} />
}