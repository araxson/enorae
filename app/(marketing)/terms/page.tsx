import { Suspense } from 'react'
import { PageLoading } from '@/features/shared/ui'
import { TermsPage, termsMetadata } from '@/features/marketing/terms'

export const metadata = termsMetadata

export default function Page() {
  return (
    <Suspense
      fallback={<PageLoading />}
    >
      <TermsPage />
    </Suspense>
  )
}
