import { Suspense } from 'react'

import { Spinner } from '@/components/ui/spinner'
import {
  MarketingExplorePage,
  exploreSEO,
} from '@/features/marketing/explore'

export const metadata = exploreSEO

export default async function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-16">
          <Spinner className="size-6 text-muted-foreground" />
        </div>
      }
    >
      <MarketingExplorePage />
    </Suspense>
  )
}
