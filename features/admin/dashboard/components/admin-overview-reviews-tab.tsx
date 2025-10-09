import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Star } from 'lucide-react'
import type { ReviewsOverview } from './admin-overview-types'

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
          <p className="text-sm text-muted-foreground">No reviews have been submitted yet.</p>
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
        <ScrollArea className="h-[320px] pr-4">
          <div className="space-y-3">
            {rows.map((review) => (
              <div key={review.id} className="rounded-lg border border-border/60 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold leading-tight">
                      {review.salon_name || 'Unknown salon'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      By {review.customer_name || 'Anonymous'}
                    </p>
                  </div>
                  <Badge variant="outline" className="gap-1 text-xs">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-500" />
                    {review.rating || 0}/5
                  </Badge>
                </div>
                <Separator className="my-3" />
                <p className="line-clamp-3 text-sm text-muted-foreground">
                  {review.comment || 'No comment provided.'}
                </p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
