import { StaffAppointments } from '@/features/staff/appointments'
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata = genMeta({
  title: 'My Appointments',
  description: 'View and manage your appointments',
  noIndex: true,
})

export default async function StaffAppointmentsPage() {
  return <StaffAppointments />
}
