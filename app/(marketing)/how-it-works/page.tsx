import { Suspense } from 'react'
import { PageLoading } from '@/features/shared/ui-components'
import { HowItWorksPage, howItWorksMetadata } from '@/features/marketing/how-it-works'

export const metadata = howItWorksMetadata

export default function Page() {
  return (
    <Suspense
      fallback={<PageLoading />}
    >
      <HowItWorksPage />
    </Suspense>
  )
}
