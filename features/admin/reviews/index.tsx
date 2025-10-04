import { Section, Stack } from '@/components/layout'
import { H1, Lead } from '@/components/ui/typography'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ReviewsList } from './components/reviews-list'
import { getAllReviews } from './api/queries'

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

  return (
    <Section size="lg">
      <Stack gap="xl">
        <div>
          <H1>All Reviews</H1>
          <Lead>Platform-wide reviews and ratings</Lead>
        </div>
        <ReviewsList reviews={reviews} />
      </Stack>
    </Section>
  )
}
