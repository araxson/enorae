import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Star } from 'lucide-react'
import type { ReviewsOverview } from './admin-overview-types'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'

type ReviewsTabProps = {
  reviews: ReviewsOverview[]
}

export function AdminOverviewReviewsTab({ reviews }: ReviewsTabProps) {
  if (reviews.length === 0) {
    return (
      <Card>
        <CardHeader>
          <ItemGroup>
            <Item variant="muted">
              <ItemContent>
                <ItemTitle>Recent reviews</ItemTitle>
                <ItemDescription>
                  Monitor sentiment and identify moderation needs quickly.
                </ItemDescription>
              </ItemContent>
            </Item>
          </ItemGroup>
        </CardHeader>
        <CardContent>
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Star aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>No reviews yet</EmptyTitle>
              <EmptyDescription>
                Reviews will appear here once customers provide feedback.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CardContent>
      </Card>
    )
  }

  const rows = reviews.slice(0, 20)

  return (
    <Card>
      <CardHeader>
        <ItemGroup>
          <Item variant="muted">
            <ItemContent>
              <ItemTitle>Recent reviews</ItemTitle>
              <ItemDescription>
                Monitor sentiment and identify moderation needs quickly.
              </ItemDescription>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80 pr-4">
          <ItemGroup>
            {rows.map((review) => (
              <Item key={review['id']} variant="outline" size="sm" className="flex-col gap-3">
                <ItemHeader>
                  <ItemTitle>{review['salon_name'] || 'Unknown salon'}</ItemTitle>
                  <ItemActions>
                    <Badge variant="outline">
                      <Star className="mr-1 size-3 text-accent" fill="currentColor" />
                      {review['rating'] || 0}/5
                    </Badge>
                  </ItemActions>
                </ItemHeader>
                <ItemContent>
                  <ItemDescription>By {review['customer_name'] || 'Anonymous'}</ItemDescription>
                  {review['comment'] ? (
                    <p className="line-clamp-3 text-sm text-muted-foreground">{review['comment']}</p>
                  ) : (
                    <Badge variant="outline">No comment provided</Badge>
                  )}
                </ItemContent>
              </Item>
            ))}
          </ItemGroup>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
