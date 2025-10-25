import { Suspense } from 'react'
import { AppointmentsManagement } from '@/features/business/appointments'
import { PageLoading } from '@/features/shared/ui-components'
import { generateMetadata as genMeta } from '@/lib/metadata'
export const metadata = genMeta({ title: 'Appointments', description: 'Manage your salon appointments and bookings', noIndex: true })
export default async function AppointmentsPage() {
  return <Suspense fallback={<PageLoading />}><AppointmentsManagement /></Suspense>
}
