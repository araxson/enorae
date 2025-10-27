import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Star } from 'lucide-react'
import type { ReviewsOverview } from './admin-overview-types'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'

type ReviewsTabProps = {
  reviews: ReviewsOverview[]
}

export function AdminOverviewReviewsTab({ reviews }: ReviewsTabProps) {
  if (reviews.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent reviews</CardTitle>
          <CardDescription>
            Monitor sentiment and identify moderation needs quickly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No reviews yet</EmptyTitle>
              <EmptyDescription>Reviews will appear here once customers provide feedback.</EmptyDescription>
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
        <CardTitle>Recent reviews</CardTitle>
        <CardDescription>
          Monitor sentiment and identify moderation needs quickly.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80 pr-4">
          <div className="space-y-3">
            {rows.map((review) => (
              <Card key={review['id']}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between gap-3">
                    <CardTitle>{review['salon_name'] || 'Unknown salon'}</CardTitle>
                    <Badge variant="outline" className="gap-1">
                      <Star className="h-3 w-3 text-accent" fill="currentColor" />
                      {review['rating'] || 0}/5
                    </Badge>
                  </div>
                  <CardDescription>By {review['customer_name'] || 'Anonymous'}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 pt-0">
                  <Separator />
                  {review['comment'] ? (
                    <p className="line-clamp-3 text-sm text-muted-foreground">
                      {review['comment']}
                    </p>
                  ) : (
                    <Badge variant="outline" className="w-fit">
                      No comment provided
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
