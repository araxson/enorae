import { Suspense } from 'react'

import { Spinner } from '@/components/ui/spinner'
import { MarketingHomeFeature, marketingHomeMetadata } from '@/features/marketing/home'

export const metadata = marketingHomeMetadata

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-16">
          <Spinner className="size-6 text-muted-foreground" />
        </div>
      }
    >
      <MarketingHomeFeature />
    </Suspense>
  )
}
