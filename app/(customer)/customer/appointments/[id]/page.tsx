import { AppointmentDetail } from '@/features/customer/appointments/components/appointment-detail'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function AppointmentDetailPage({ params }: PageProps) {
  const { id } = await params
  return <AppointmentDetail appointmentId={id} />
}
