import { Suspense } from 'react'
import { PageLoading } from '@/components/shared'
import { CustomerReviews } from '@/features/customer/reviews'

export default function CustomerReviewsPage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <CustomerReviews />
    </Suspense>
  )
}
