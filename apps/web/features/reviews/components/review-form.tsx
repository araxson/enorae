'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { Button, Label, Textarea } from '@enorae/ui'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@enorae/ui'
import { createReview } from '../actions/reviews.actions'

interface ReviewFormProps {
  salonId: string
  appointmentId: string
}

export function ReviewForm({ salonId, appointmentId }: ReviewFormProps) {
  const [ratings, setRatings] = useState({
    overall: 0,
    service: 0,
    staff: 0,
    ambience: 0,
    cleanliness: 0,
  })

  const RatingInput = ({ label, value, onChange }: any) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="transition-colors"
          >
            <Star
              className={`h-6 w-6 ${
                star <= value ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leave a Review</CardTitle>
        <CardDescription>
          Share your experience to help others make informed decisions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={createReview} className="space-y-4">
          <input type="hidden" name="salonId" value={salonId} />
          <input type="hidden" name="appointmentId" value={appointmentId} />
          <input type="hidden" name="rating" value={ratings.overall} />
          <input type="hidden" name="serviceRating" value={ratings.service} />
          <input type="hidden" name="staffRating" value={ratings.staff} />
          <input type="hidden" name="ambienceRating" value={ratings.ambience} />
          <input type="hidden" name="cleanlinessRating" value={ratings.cleanliness} />

          <RatingInput
            label="Overall Experience"
            value={ratings.overall}
            onChange={(val: number) => setRatings({ ...ratings, overall: val })}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <RatingInput
              label="Service Quality"
              value={ratings.service}
              onChange={(val: number) => setRatings({ ...ratings, service: val })}
            />
            <RatingInput
              label="Staff Professionalism"
              value={ratings.staff}
              onChange={(val: number) => setRatings({ ...ratings, staff: val })}
            />
            <RatingInput
              label="Ambience"
              value={ratings.ambience}
              onChange={(val: number) => setRatings({ ...ratings, ambience: val })}
            />
            <RatingInput
              label="Cleanliness"
              value={ratings.cleanliness}
              onChange={(val: number) => setRatings({ ...ratings, cleanliness: val })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Comments (Optional)</Label>
            <Textarea
              id="comment"
              name="comment"
              placeholder="Share your experience..."
              rows={4}
            />
          </div>

          <Button type="submit" className="w-full">
            Submit Review
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}