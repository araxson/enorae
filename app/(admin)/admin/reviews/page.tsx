import { AdminReviews } from '@/features/admin/reviews'
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata = genMeta({
  title: 'All Reviews',
  description: 'Platform-wide reviews moderation',
  noIndex: true,
})

export default function AdminReviewsPage() {
  return <AdminReviews />
}
