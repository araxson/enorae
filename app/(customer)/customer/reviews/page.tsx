import { Suspense } from 'react'
import { PageLoading } from '@/features/shared/ui-components'
import { CustomerReviews } from '@/features/customer/reviews'

export default function CustomerReviewsPage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <CustomerReviews />
    </Suspense>
  )
}
