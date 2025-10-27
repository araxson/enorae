import { Suspense } from 'react'

import { Spinner } from '@/components/ui/spinner'
import { ContactPage, contactMetadata } from '@/features/marketing/contact'

export const metadata = contactMetadata

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-16">
          <Spinner className="size-6 text-muted-foreground" />
        </div>
      }
    >
      <ContactPage />
    </Suspense>
  )
}
