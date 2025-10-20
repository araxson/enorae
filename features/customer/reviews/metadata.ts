import 'server-only'

import { generateMetadata as genMeta } from '@/lib/metadata'

export function generateReviewsMetadata() {
  return genMeta({
    title: 'My Reviews',
    description: 'View and manage your salon reviews. Share your experiences and help others discover great salons.',
    keywords: ['reviews', 'my reviews', 'salon reviews', 'ratings', 'feedback', 'testimonials'],
  })
}
