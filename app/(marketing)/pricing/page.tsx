import { Suspense } from 'react'

import { Spinner } from '@/components/ui/spinner'
import { PricingPage, pricingSEO } from '@/features/marketing/pricing'

export const metadata = pricingSEO

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-16">
          <Spinner className="size-6 text-muted-foreground" />
        </div>
      }
    >
      <PricingPage />
    </Suspense>
  )
}
