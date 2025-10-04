import { Section } from '@/components/layout'
import { getReviewsForModeration, getModerationStats } from './api/queries'
import { ModerationClient } from './components/moderation-client'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'

export async function AdminModeration() {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  // Fetch reviews and stats in parallel
  const [reviews, stats] = await Promise.all([
    getReviewsForModeration(),
    getModerationStats(),
  ])

  return (
    <Section size="lg">
      <ModerationClient reviews={reviews} stats={stats} />
    </Section>
  )
}
