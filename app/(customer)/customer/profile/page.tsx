import { Suspense } from 'react'
import { PageLoading } from '@/components/shared'
import { CustomerProfile } from '@/features/customer/profile'
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata = genMeta({
  title: 'My Profile',
  description: 'Manage your profile and view your appointment history.',
  noIndex: true,
})

export default function CustomerProfilePage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <CustomerProfile />
    </Suspense>
  )
}
