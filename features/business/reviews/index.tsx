import { Section, Stack } from '@/components/layout'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { getSalonReviews, getReviewStats } from './api/queries'
import { ReviewsList } from './components/reviews-list'
import { ReviewsStats } from './components/reviews-stats'
import { requireAnyRole, requireUserSalonId, ROLE_GROUPS } from '@/lib/auth'

export async function SalonReviews() {
  let reviews
  let salonId: string | null = null

  try {
    await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
    salonId = await requireUserSalonId()
    reviews = await getSalonReviews()
  } catch (error) {
    return (
      <Section size="lg">
        <Alert>
          <AlertDescription>
            {error instanceof Error ? error.message : 'Please log in to view reviews'}
          </AlertDescription>
        </Alert>
      </Section>
    )
  }

  const stats = salonId ? await getReviewStats(salonId) : {
    totalReviews: 0,
    averageRating: 0,
    ratingDistribution: [5, 4, 3, 2, 1].map(rating => ({ rating, count: 0 })),
    pendingResponses: 0,
    flaggedCount: 0,
  }

  return (
    <Section size="lg">
      <Stack gap="xl">
        <ReviewsStats stats={stats} />

        <ReviewsList reviews={reviews} />
      </Stack>
    </Section>
  )
}
