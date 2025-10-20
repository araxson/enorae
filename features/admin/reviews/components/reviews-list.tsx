import { Star, Building2, User } from 'lucide-react'
import { Stack } from '@/components/layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import type { Database } from '@/lib/types/database.types'

type AdminReview = Database['public']['Views']['admin_reviews_overview']['Row']

interface ReviewsListProps {
  reviews: AdminReview[]
}

export function ReviewsList({ reviews }: ReviewsListProps) {
  if (reviews.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="leading-7 text-center text-muted-foreground py-8">No reviews found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {reviews.map((review) => (
        <Card key={review.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  {review.salon_name}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < (review.rating || 0)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground text-sm">{review.rating}/5</p>
                </div>
              </div>
              <div className="flex gap-2">
                {review.is_verified && <Badge>Verified</Badge>}
                {review.is_featured && <Badge variant="secondary">Featured</Badge>}
                {review.is_flagged && <Badge variant="destructive">Flagged</Badge>}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Stack gap="md">
              {review.title && <p className="leading-7 font-medium">{review.title}</p>}
              {review.comment && <p className="leading-7 text-sm text-muted-foreground">{review.comment}</p>}

              <div className="grid grid-cols-3 gap-4 pt-2 border-t">
                {review.service_quality_rating && (
                  <div>
                    <p className="text-sm text-muted-foreground text-xs">Service Quality</p>
                    <p className="leading-7 text-sm font-medium">{review.service_quality_rating}/5</p>
                  </div>
                )}
                {review.cleanliness_rating && (
                  <div>
                    <p className="text-sm text-muted-foreground text-xs">Cleanliness</p>
                    <p className="leading-7 text-sm font-medium">{review.cleanliness_rating}/5</p>
                  </div>
                )}
                {review.value_rating && (
                  <div>
                    <p className="text-sm text-muted-foreground text-xs">Value</p>
                    <p className="leading-7 text-sm font-medium">{review.value_rating}/5</p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="w-3 h-3" />
                  <span>{review.customer_name || 'Anonymous'}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground text-xs">
                    {review.created_at ? format(new Date(review.created_at), 'MMM dd, yyyy') : 'N/A'}
                  </p>
                  {review.helpful_count && review.helpful_count > 0 && (
                    <p className="leading-7 text-xs">{review.helpful_count} found helpful</p>
                  )}
                </div>
              </div>

              {review.has_response && review.response_date && (
                <div className="mt-4 p-3 bg-muted rounded-md">
                  <p className="leading-7 text-sm font-medium mb-1">Salon Response</p>
                  <p className="text-sm text-muted-foreground text-xs">
                    Responded on {format(new Date(review.response_date), 'MMM dd, yyyy')}
                  </p>
                </div>
              )}
            </Stack>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
