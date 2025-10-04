import { Suspense } from 'react'
import { CustomerAppointments, AppointmentsSkeleton } from '@/features/customer/appointments'
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata = genMeta({
  title: 'My Appointments',
  description: 'View and manage your salon appointments',
  noIndex: true,
})

export default async function CustomerAppointmentsPage() {
  return (
    <Suspense fallback={<AppointmentsSkeleton />}>
      <CustomerAppointments />
    </Suspense>
  )
}
