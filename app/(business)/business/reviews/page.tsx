import { SalonReviews } from '@/features/business/reviews'
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata = genMeta({
  title: 'Reviews',
  description: 'View and respond to customer reviews',
  noIndex: true,
})

export default async function ReviewsPage() {
  return <SalonReviews />
}
