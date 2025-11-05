import { Suspense } from 'react'
import { ServicesDirectoryPage, marketingServicesDirectoryMetadata } from '@/features/marketing/services-directory'
import { PageLoading } from '@/features/shared/ui'

export const metadata = marketingServicesDirectoryMetadata

export default async function ServicesPage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <ServicesDirectoryPage />
    </Suspense>
  )
}
