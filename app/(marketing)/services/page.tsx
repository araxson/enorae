import { Suspense } from 'react'

import { Spinner } from '@/components/ui/spinner'
import {
  ServicesDirectoryPage,
  marketingServicesDirectoryMetadata,
} from '@/features/marketing/services-directory'

export const metadata = marketingServicesDirectoryMetadata

export default async function ServicesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-16">
          <Spinner className="size-6 text-muted-foreground" />
        </div>
      }
    >
      <ServicesDirectoryPage />
    </Suspense>
  )
}
