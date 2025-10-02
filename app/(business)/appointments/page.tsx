import { AppointmentsManagement } from '@/features/appointments-management'
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata = genMeta({
  title: 'Appointments',
  description: 'Manage your salon appointments and bookings',
  noIndex: true,
})

export default async function AppointmentsPage() {
  return <AppointmentsManagement />
}
