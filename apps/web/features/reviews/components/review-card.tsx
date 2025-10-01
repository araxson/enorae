import { Star } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@enorae/ui'
import { Card, CardContent, CardHeader } from '@enorae/ui'

interface ReviewCardProps {
  review: {
    id: string
    rating: number
    comment?: string
    created_at: string
    profiles: {
      full_name: string
      avatar_url?: string
    }
  }
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={review.profiles.avatar_url} />
              <AvatarFallback>
                {review.profiles.full_name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{review.profiles.full_name}</p>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          <time className="text-sm text-muted-foreground">
            {new Date(review.created_at).toLocaleDateString()}
          </time>
        </div>
      </CardHeader>
      {review.comment && (
        <CardContent>
          <p className="text-muted-foreground">{review.comment}</p>
        </CardContent>
      )}
    </Card>
  )
}