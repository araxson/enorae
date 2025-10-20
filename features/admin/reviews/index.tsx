import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ReviewsClient } from './components/reviews-client'
import { getAllReviews } from './api/queries'
import { LastUpdated } from '@/features/admin/admin-common/components'
import { Card, CardContent } from '@/components/ui/card'

export async function AdminReviews() {
  let reviews

  try {
    reviews = await getAllReviews(100)
  } catch (error) {
    return (
      <section className="py-16 md:py-24 lg:py-32">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <Alert variant="destructive">
          <AlertDescription>
            {error instanceof Error ? error.message : 'Failed to load reviews'}
          </AlertDescription>
        </Alert>
        </div>
      </section>
    )
  }

  // Calculate moderation stats
  const flaggedCount = reviews.filter(r => r.is_flagged).length
  const unverifiedCount = reviews.filter(r => !r.is_verified).length
  const needsResponseCount = reviews.filter(r => !r.has_response).length

  return (
    <section className="py-16 md:py-24 lg:py-32">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10">
        <div className="flex justify-end">
          <LastUpdated />
        </div>

        {/* Moderation Stats */}
        <div className="flex flex-wrap gap-6">
          {[{
            label: 'Total Reviews',
            value: reviews.length,
            tone: 'text-foreground',
          },
          {
            label: 'Flagged',
            value: flaggedCount,
            tone: 'text-destructive',
          },
          {
            label: 'Unverified',
            value: unverifiedCount,
            tone: 'text-warning',
          },
          {
            label: 'Needs Response',
            value: needsResponseCount,
            tone: 'text-info',
          }].map(stat => (
            <Card key={stat.label} className="min-w-40">
              <CardContent className="py-4">
                <div className="flex flex-col gap-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    {stat.label}
                  </p>
                  <p className={cn('text-2xl font-semibold leading-7', stat.tone)}>
                    {stat.value}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <ReviewsClient reviews={reviews} />
        </div>
      </div>
    </section>
  )
}
