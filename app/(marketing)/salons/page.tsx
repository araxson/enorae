import { Suspense } from 'react'
import { SalonDirectoryPage, marketingSalonDirectoryMetadata } from '@/features/marketing/salon-directory'
import { PageLoading } from '@/features/shared/ui'

export const metadata = marketingSalonDirectoryMetadata

type PageProps = Parameters<typeof SalonDirectoryPage>[0]

export default function Page(props: PageProps) {
  return (
    <Suspense fallback={<PageLoading />}>
      <SalonDirectoryPage {...props} />
    </Suspense>
  )
}
