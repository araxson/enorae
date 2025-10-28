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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, Trash2 } from 'lucide-react'
import { deleteReview } from '@/features/customer/reviews/api/mutations'
import type { Review } from '@/features/customer/reviews/types'
import { Spinner } from '@/components/ui/spinner'
import { ButtonGroup } from '@/components/ui/button-group'

interface DeleteReviewDialogProps {
  review: Review
  children?: React.ReactNode
}

export function DeleteReviewDialog({ review, children }: DeleteReviewDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    if (!review['salon_id'] || !review['id']) {
      setError('Review ID or Salon ID not found')
      return
    }

    setIsLoading(true)
    setError(null)

    const result = await deleteReview(review['id'], review['salon_id'])

    if (result.success) {
      setOpen(false)
      router.refresh()
    } else {
      setError(result.error || 'Failed to delete review')
    }

    setIsLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="ghost" size="sm" className="flex-1">
            <Trash2 className="mr-2 size-4" />
            Delete
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete review</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this review? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {review['comment'] && (
          <Alert>
            <AlertTitle>Your review</AlertTitle>
            <AlertDescription>{review['comment']}</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertTitle>Delete failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <DialogFooter>
          <ButtonGroup aria-label="Actions">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner className="size-4" />
                  <span>Deleting</span>
                </>
              ) : (
                <span>Delete review</span>
              )}
            </Button>
          </ButtonGroup>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
