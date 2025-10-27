import { Suspense } from 'react'

import { Spinner } from '@/components/ui/spinner'
import { TermsPage, termsMetadata } from '@/features/marketing/terms'

export const metadata = termsMetadata

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-16">
          <Spinner className="size-6 text-muted-foreground" />
        </div>
      }
    >
      <TermsPage />
    </Suspense>
  )
}
