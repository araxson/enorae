import { Suspense } from 'react'
import { CustomerAppointments } from '@/features/customer/appointments'
import { PageLoading } from '@/components/shared'
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata = genMeta({ title: 'My Appointments', description: 'View and manage your salon appointments', noIndex: true })

export default function CustomerAppointmentsPage() {
  return <Suspense fallback={<PageLoading />}><CustomerAppointments /></Suspense>
}
