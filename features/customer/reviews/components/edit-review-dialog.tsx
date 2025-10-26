'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Toggle } from '@/components/ui/toggle'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, Pencil, Star } from 'lucide-react'
import { updateReview } from '@/features/customer/reviews/api/mutations'
import type { Review } from '@/features/customer/reviews/types'

interface EditReviewDialogProps {
  review: Review
  children?: React.ReactNode
}

export function EditReviewDialog({ review, children }: EditReviewDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [rating, setRating] = useState(review['rating'] || 3)

  // Calculate if within edit window (7 days)
  const daysSince = review['created_at']
    ? (Date.now() - new Date(review['created_at']).getTime()) / (1000 * 60 * 60 * 24)
    : 999
  const canEdit = daysSince <= 7

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData(e.currentTarget)
      const result = await updateReview(review?.['id'] || '', formData)

      if (result.success) {
        setOpen(false)
        router.refresh()
      } else {
        setError(result.error || 'Failed to update review')
      }
    } catch (error) {
      console.error('Error updating review:', error)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm" className="flex-1">
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit review</DialogTitle>
          <DialogDescription>
            {canEdit
              ? `Update your review. You can edit this review within 7 days of posting (${Math.ceil(7 - daysSince)} days remaining).`
              : 'This review can no longer be edited (7-day window expired).'}
          </DialogDescription>
        </DialogHeader>

        {!canEdit ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Edit window expired</AlertTitle>
            <AlertDescription>
              Reviews can only be edited within 7 days of creation. This review was posted{' '}
              {Math.floor(daysSince)} days ago.
            </AlertDescription>
          </Alert>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="hidden" name="salonId" value={review['salon_id'] || ''} />

            <div className="space-y-2">
              <Label htmlFor="rating">Overall rating *</Label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <Toggle
                    key={value}
                    pressed={value <= rating}
                    onPressedChange={(pressed) =>
                      setRating(pressed ? value : Math.max(1, value - 1))
                    }
                    aria-label={`Rate ${value} star${value === 1 ? '' : 's'}`}
                    className="h-10 w-10"
                    type="button"
                  >
                    <Star className="h-5 w-5" aria-hidden="true" />
                  </Toggle>
                ))}
                <span>{rating} out of 5</span>
              </div>
              <input type="hidden" name="rating" value={rating} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title (optional)</Label>
              <Input
                id="title"
                name="title"
                defaultValue=""
                placeholder="Summarize your experience"
                maxLength={200}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="comment">Your review *</Label>
              <Textarea
                id="comment"
                name="comment"
                defaultValue={review['comment'] || ''}
                placeholder="Share your experience..."
                rows={5}
                required
                minLength={10}
                maxLength={2000}
              />
              <span>Minimum 10 characters, maximum 2000</span>
            </div>


            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Update failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Update review'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
