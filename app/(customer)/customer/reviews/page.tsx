import { Suspense } from 'react'
import { PageLoading } from '@/components/shared'
import { CustomerReviews } from '@/features/customer/reviews'

export default async function CustomerReviewsPage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <CustomerReviews />
    </Suspense>
  )
}
