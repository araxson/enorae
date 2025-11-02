import { Suspense } from 'react'
import { PageLoading } from '@/features/shared/ui-components'
import { PricingPage, pricingSEO } from '@/features/marketing/pricing'

export const metadata = pricingSEO

export default function Page() {
  return (
    <Suspense
      fallback={<PageLoading />}
    >
      <PricingPage />
    </Suspense>
  )
}
