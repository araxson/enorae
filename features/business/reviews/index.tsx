import { Section, Stack, Box } from '@/components/layout'
import { H1, Lead } from '@/components/ui/typography'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { getSalonReviews, getReviewStats } from './api/queries'
import { ReviewsList } from './components/reviews-list'
import { ReviewsStats } from './components/reviews-stats'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'

export async function SalonReviews() {
  let reviews
  let salonId: string | null = null

  try {
    const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
    const supabase = await createClient()

    const { data: staffProfile } = await supabase
      .from('staff')
      .select('salon_id')
      .eq('user_id', session.user.id)
      .single<{ salon_id: string | null }>()

    salonId = staffProfile?.salon_id || null

    if (!salonId) {
      throw new Error('Salon not found')
    }

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
        <Box>
          <H1>Customer Reviews</H1>
          <Lead>Manage and respond to customer feedback</Lead>
        </Box>

        <ReviewsStats stats={stats} />

        <ReviewsList reviews={reviews} />
      </Stack>
    </Section>
  )
}
