import { getReviewsForModeration, getModerationStats } from '@/features/admin/moderation/api/queries'
import { ModerationClient } from '@/features/admin/moderation/components/moderation-client'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'

export async function AdminModeration() {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const [reviews, stats] = await Promise.all([
    getReviewsForModeration(),
    getModerationStats(),
  ])

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <ModerationClient reviews={reviews} stats={stats} />
    </div>
  )
}
export * from './types'
