import { Suspense } from 'react'

import { Spinner } from '@/components/ui/spinner'
import { PrivacyPage, privacyMetadata } from '@/features/marketing/privacy'

export const metadata = privacyMetadata

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-16">
          <Spinner className="size-6 text-muted-foreground" />
        </div>
      }
    >
      <PrivacyPage />
    </Suspense>
  )
}
