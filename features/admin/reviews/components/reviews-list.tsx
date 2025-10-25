import { Star, Building2, User } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import type { Database } from '@/lib/types/database.types'

type AdminReview = Database['public']['Views']['admin_reviews_overview']['Row']

interface ReviewsListProps {
  reviews: AdminReview[]
}

export function ReviewsList({ reviews }: ReviewsListProps) {
  if (reviews.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
          <CardDescription>No review activity found.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground py-8">No reviews found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {reviews.map((review) => (
        <Card key={review['id']}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  <CardTitle>{review['salon_name']}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => {
                      const rating = review['rating'] ?? 0
                      const isFilled = i < Math.round(rating)
                      return (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${isFilled ? 'text-accent' : 'text-muted-foreground'}`}
                          fill={isFilled ? 'currentColor' : 'none'}
                        />
                      )
                    })}
                  </div>
                  <p className="text-sm text-muted-foreground">{review['rating']}/5</p>
                </div>
              </div>
              <div className="flex gap-2">
                {review['is_verified'] && <Badge>Verified</Badge>}
                {review['is_featured'] && <Badge variant="secondary">Featured</Badge>}
                {review['is_flagged'] && <Badge variant="destructive">Flagged</Badge>}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              {review['title'] && <p className="font-medium">{review['title']}</p>}
              {review['comment'] && <p className="text-sm text-muted-foreground">{review['comment']}</p>}

              <Separator />
              <div className="grid grid-cols-3 gap-4 pt-2">
                {review['service_quality_rating'] && (
                  <div>
                    <p className="text-xs text-muted-foreground">Service Quality</p>
                    <p className="text-sm font-medium">{review['service_quality_rating']}/5</p>
                  </div>
                )}
                {review['cleanliness_rating'] && (
                  <div>
                    <p className="text-xs text-muted-foreground">Cleanliness</p>
                    <p className="text-sm font-medium">{review['cleanliness_rating']}/5</p>
                  </div>
                )}
                {review['value_rating'] && (
                  <div>
                    <p className="text-xs text-muted-foreground">Value</p>
                    <p className="text-sm font-medium">{review['value_rating']}/5</p>
                  </div>
                )}
              </div>

              <Separator />
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="w-3 h-3" />
                  <span>{review['customer_name'] || 'Anonymous'}</span>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">
                    {review['created_at'] ? format(new Date(review['created_at']), 'MMM dd, yyyy') : 'N/A'}
                  </p>
                  {review['helpful_count'] && review['helpful_count'] > 0 && (
                    <p className="text-xs">{review['helpful_count']} found helpful</p>
                  )}
                </div>
              </div>

              {review['has_response'] && review['response_date'] && (
                <Alert className="mt-4">
                  <AlertTitle>Salon Response</AlertTitle>
                  <AlertDescription>
                    Responded on {format(new Date(review['response_date']), 'MMM dd, yyyy')}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
