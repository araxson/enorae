import { Suspense } from 'react'

import { Spinner } from '@/components/ui/spinner'
import { AboutPage, aboutSEO } from '@/features/marketing/about'

export const metadata = aboutSEO

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-16">
          <Spinner className="size-6 text-muted-foreground" />
        </div>
      }
    >
      <AboutPage />
    </Suspense>
  )
}
