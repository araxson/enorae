import { AdminAppointments } from '@/features/admin/appointments'
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata = genMeta({
  title: 'All Appointments',
  description: 'Platform-wide appointments overview',
  noIndex: true,
})

export default function AdminAppointmentsPage() {
  return <AdminAppointments />
}
