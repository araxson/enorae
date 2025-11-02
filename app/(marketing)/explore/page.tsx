import { Suspense } from 'react'
import { MarketingExplorePage, exploreSEO } from '@/features/marketing/explore'
import { PageLoading } from '@/features/shared/ui-components'

export const metadata = exploreSEO

export default async function ExplorePage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <MarketingExplorePage />
    </Suspense>
  )
}
