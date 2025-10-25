import { Suspense } from 'react'
import { StaffServices } from '@/features/business/staff-services'
import { PageLoading } from '@/features/shared/ui-components'
import { generateMetadata as genMeta } from '@/lib/metadata'
export const metadata = genMeta({ title: 'Staff Services', description: 'Manage services for staff member', noIndex: true })
export default async function StaffServicesPage(props: { params: Promise<{ 'staff-id': string }> }) {
  return (
    <Suspense fallback={<PageLoading />}>
      <StaffServices {...props} />
    </Suspense>
  )
}
