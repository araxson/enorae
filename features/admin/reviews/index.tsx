import { cn } from "@/lib/utils";
import { Section, Stack, Flex } from '@/components/layout'
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
      <Section size="lg">
        <Alert variant="destructive">
          <AlertDescription>
            {error instanceof Error ? error.message : 'Failed to load reviews'}
          </AlertDescription>
        </Alert>
      </Section>
    )
  }

  // Calculate moderation stats
  const flaggedCount = reviews.filter(r => r.is_flagged).length
  const unverifiedCount = reviews.filter(r => !r.is_verified).length
  const needsResponseCount = reviews.filter(r => !r.has_response).length

  return (
    <Section size="lg">
      <Stack gap="xl">
        <Flex justify="end" align="start">
          <LastUpdated />
        </Flex>

        {/* Moderation Stats */}
        <Flex gap="md" className="flex-wrap">
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
            tone: 'text-orange-500',
          },
          {
            label: 'Needs Response',
            value: needsResponseCount,
            tone: 'text-blue-500',
          }].map(stat => (
            <Card key={stat.label} className="min-w-[160px]">
              <CardContent className="py-4">
                <Stack gap="xs">
                  <p className="text-sm text-muted-foreground uppercase tracking-wide text-xs">
                    {stat.label}
                  </p>
                  <p className={cn('leading-7', `text-2xl font-semibold ${stat.tone}`)}>
                    {stat.value}
                  </p>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Flex>

        <ReviewsClient reviews={reviews} />
      </Stack>
    </Section>
  )
}
