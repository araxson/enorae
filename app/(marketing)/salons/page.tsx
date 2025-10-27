import { Suspense } from 'react'

import { Spinner } from '@/components/ui/spinner'
import {
  SalonDirectoryPage,
  marketingSalonDirectoryMetadata,
} from '@/features/marketing/salon-directory'

export const metadata = marketingSalonDirectoryMetadata

type PageProps = Parameters<typeof SalonDirectoryPage>[0]

export default function Page(props: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-16">
          <Spinner className="size-6 text-muted-foreground" />
        </div>
      }
    >
      <SalonDirectoryPage {...props} />
    </Suspense>
  )
}
