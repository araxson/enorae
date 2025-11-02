import { Suspense } from 'react'
import { PageLoading } from '@/features/shared/ui-components'
import { MarketingHomeFeature, marketingHomeMetadata } from '@/features/marketing/home'

export const metadata = marketingHomeMetadata

export default function Page() {
  return (
    <Suspense
      fallback={<PageLoading />}
    >
      <MarketingHomeFeature />
    </Suspense>
  )
}
