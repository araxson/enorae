import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import { AdminSection, LastUpdated } from '@/features/admin/common/components'
import { getAllReviews } from '../api/queries'
import { ReviewsClient } from './reviews-client'

export async function AdminReviews() {
  let reviews

  try {
    reviews = await getAllReviews(100)
  } catch (error) {
    return (
      <AdminSection>
        <Alert variant="destructive">
          <AlertTitle>Failed to load reviews</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : 'Failed to load reviews'}
          </AlertDescription>
        </Alert>
      </AdminSection>
    )
  }

  const flaggedCount = reviews.filter((r) => r['is_flagged']).length
  const unverifiedCount = reviews.filter((r) => !r['is_verified']).length
  const needsResponseCount = reviews.filter((r) => !r['has_response']).length

  return (
    <AdminSection>
      <div className="flex flex-col gap-10">
        <div className="flex justify-end">
          <ItemGroup>
            <Item variant="muted" size="sm">
              <ItemContent>
                <LastUpdated />
              </ItemContent>
            </Item>
          </ItemGroup>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
            <Item key={stat.label} variant="outline">
              <ItemContent className="gap-1">
                <ItemDescription>{stat.label}</ItemDescription>
                <ItemTitle>
                  <span className="text-2xl font-semibold">{stat.value}</span>
                </ItemTitle>
              </ItemContent>
            </Item>
          ))}
        </div>

        <ReviewsClient reviews={reviews} />
      </div>
    </AdminSection>
  )
}
