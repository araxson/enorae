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
import { deleteReview } from '../api/mutations'
import type { Database } from '@/lib/types/database.types'

type Review = Database['public']['Views']['salon_reviews_view']['Row']

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
    if (!review.salon_id || !review.id) {
      setError('Review ID or Salon ID not found')
      return
    }

    setIsLoading(true)
    setError(null)

    const result = await deleteReview(review.id, review.salon_id)

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
            <Trash2 className="mr-2 h-4 w-4" />
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

        {review.title && (
          <Alert>
            <AlertTitle>{review.title}</AlertTitle>
            {review.comment && <AlertDescription>{review.comment}</AlertDescription>}
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
            {isLoading ? 'Deleting...' : 'Delete review'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
