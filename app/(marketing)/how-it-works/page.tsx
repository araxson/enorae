import { Suspense } from 'react'

import { Spinner } from '@/components/ui/spinner'
import { HowItWorksPage, howItWorksMetadata } from '@/features/marketing/how-it-works'

export const metadata = howItWorksMetadata

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-16">
          <Spinner className="size-6 text-muted-foreground" />
        </div>
      }
    >
      <HowItWorksPage />
    </Suspense>
  )
}
