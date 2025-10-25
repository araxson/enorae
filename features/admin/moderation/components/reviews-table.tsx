'use client'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Label } from '@/components/ui/label'
import { flagReview, unflagReview, deleteReview, featureReview } from '@/features/admin/moderation/api/mutations'
import type { ModerationReview } from '@/features/admin/moderation/api/queries'
import { ReviewsTableRow } from './reviews-table-row'

const EMPTY_MESSAGE = 'No reviews found'

type ReviewsTableProps = {
  reviews: ModerationReview[]
  onViewDetail: (review: ModerationReview) => void
}

type DialogState = {
  type: 'flag' | 'unflag' | 'feature' | 'delete' | null
  review?: ModerationReview
}

export function ReviewsTable({ reviews, onViewDetail }: ReviewsTableProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [dialog, setDialog] = useState<DialogState>({ type: null })
  const [reason, setReason] = useState('')
  const [reasonError, setReasonError] = useState<string | null>(null)

  const requiresReason = dialog['type'] === 'flag' || dialog['type'] === 'delete'

  const openDialog = (type: DialogState['type'], review: ModerationReview) => {
    setDialog({ type, review })
    setReason('')
    setReasonError(null)
  }

  const closeDialog = () => {
    setDialog({ type: null })
    setReason('')
    setReasonError(null)
  }

  const handleAction = async () => {
    if (!dialog.review || !dialog.review['id']) return

    if (requiresReason) {
      if (reason.trim().length < 10) {
        setReasonError('Please provide a reason with at least 10 characters.')
        return
      }
    }

    const reviewId = dialog.review['id']
    setLoadingId(reviewId)

    try {
      const formData = new FormData()
      formData.append('reviewId', reviewId)

      switch (dialog['type']) {
        case 'flag': {
          formData.append('reason', reason.trim())
          const result = await flagReview(formData)
          if (result?.error) throw new Error(result.error)
          toast.success('The review has been flagged for moderation.')
          break
        }
        case 'unflag': {
          const result = await unflagReview(formData)
          if (result?.error) throw new Error(result.error)
          toast.success('The flag has been removed from this review.')
          break
        }
        case 'feature': {
          const nextValue = !(dialog.review['is_featured'] ?? false)
          formData.append('isFeatured', nextValue.toString())
          const result = await featureReview(formData)
          if (result?.error) throw new Error(result.error)
          toast.success(nextValue ? 'The review has been featured.' : 'The review is no longer featured.')
          break
        }
        case 'delete': {
          formData.append('reason', reason.trim())
          const result = await deleteReview(formData)
          if (result?.error) throw new Error(result.error)
          toast.success('The review has been deleted.')
          break
        }
        default:
          break
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Action failed'
      toast.error(message)
      return
    } finally {
      setLoadingId(null)
      closeDialog()
    }
  }

  const dialogContent = useMemo(() => {
    if (!dialog.review || !dialog['type']) return null

    const reviewLabel = dialog.review['customer_name'] || dialog.review['customer_email'] || 'Review'

    const titles: Record<NonNullable<DialogState['type']>, string> = {
      flag: 'Flag Review',
      unflag: 'Remove Flag from Review',
      feature: dialog.review['is_featured'] ? 'Unfeature Review' : 'Feature Review',
      delete: 'Delete Review',
    }

    const descriptions: Record<NonNullable<DialogState['type']>, string> = {
      flag: 'Flagging will move the review into the moderation queue for additional review.',
      unflag: 'This will remove the moderation flag and return the review to normal visibility.',
      feature: dialog.review['is_featured']
        ? 'This will remove the review from featured placements.'
        : 'Featuring will highlight this review across the platform.',
      delete: 'This will permanently delete the review and cannot be undone.',
    }

    return { title: titles[dialog['type']], description: descriptions[dialog['type']], reviewLabel }
  }, [dialog])

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Reviews moderation</CardTitle>
          <CardDescription>Review customer feedback and take moderation actions.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Salon</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Review</TableHead>
                <TableHead>Sentiment</TableHead>
                <TableHead>Risk</TableHead>
                <TableHead>Reputation</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-muted-foreground">
                    {EMPTY_MESSAGE}
                  </TableCell>
                </TableRow>
              ) : (
                reviews.map((review) => (
                  <ReviewsTableRow
                    key={review['id']}
                    review={review}
                    loadingId={loadingId}
                    onViewDetail={onViewDetail}
                    onFlag={(r) => openDialog('flag', r)}
                    onUnflag={(r) => openDialog('unflag', r)}
                    onToggleFeature={(r) => openDialog('feature', r)}
                    onDelete={(r) => openDialog('delete', r)}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={dialog['type'] !== null} onOpenChange={(open) => (open ? void 0 : closeDialog())}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dialogContent?.['title']}</AlertDialogTitle>
            <AlertDialogDescription>{dialogContent?.['description']}</AlertDialogDescription>
            <AlertDialogDescription className="mt-2">
              Review by: {dialogContent?.reviewLabel}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {requiresReason && (
            <div className="space-y-2">
              <Label htmlFor="moderation-reason">Reason (required)</Label>
              <Textarea
                id="moderation-reason"
                value={reason}
                onChange={(event) => {
                  setReason(event.target.value)
                  setReasonError(null)
                }}
                placeholder="Provide context for this action"
                aria-invalid={Boolean(reasonError)}
                autoFocus
              />
              {reasonError && <p className="text-sm text-destructive">{reasonError}</p>}
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={loadingId !== null}>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button onClick={handleAction} disabled={loadingId !== null} variant={dialog['type'] === 'delete' ? 'destructive' : 'default'}>
                {loadingId !== null ? 'Processing...' : 'Confirm'}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
