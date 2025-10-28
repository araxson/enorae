import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import { LastUpdated } from '@/features/admin/admin-common/components'
import { getAllReviews } from '../api/queries'
import { ReviewsClient } from './reviews-client'

export async function AdminReviews() {
  let reviews

  try {
    reviews = await getAllReviews(100)
  } catch (error) {
    return (
      <section className="py-16 md:py-24 lg:py-32">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <Alert variant="destructive">
            <AlertTitle>Failed to load reviews</AlertTitle>
            <AlertDescription>
              {error instanceof Error ? error.message : 'Failed to load reviews'}
            </AlertDescription>
          </Alert>
        </div>
      </section>
    )
  }

  const flaggedCount = reviews.filter((r) => r['is_flagged']).length
  const unverifiedCount = reviews.filter((r) => !r['is_verified']).length
  const needsResponseCount = reviews.filter((r) => !r['has_response']).length

  return (
    <section className="py-16 md:py-24 lg:py-32">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10">
          <ItemGroup className="justify-end">
            <Item variant="muted" size="sm">
              <ItemContent>
                <LastUpdated />
              </ItemContent>
            </Item>
          </ItemGroup>

          <ItemGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: 'Total reviews',
                value: reviews.length,
              },
              {
                label: 'Flagged',
                value: flaggedCount,
              },
              {
                label: 'Unverified',
                value: unverifiedCount,
              },
              {
                label: 'Needs response',
                value: needsResponseCount,
              },
            ].map((stat) => (
              <Item key={stat.label} variant="outline" className="items-start">
                <ItemContent className="gap-1">
                  <ItemDescription>{stat.label}</ItemDescription>
                  <ItemTitle className="text-2xl font-semibold">{stat.value}</ItemTitle>
                </ItemContent>
              </Item>
            ))}
          </ItemGroup>

          <ReviewsClient reviews={reviews} />
        </div>
      </div>
    </section>
  )
}
