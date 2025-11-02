'use client'

import { memo, useCallback } from 'react'
import { Flag, MessageSquare, TrendingUp } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { ItemActions } from '@/components/ui/item'
import { ButtonGroup } from '@/components/ui/button-group'
import type { NormalizedReview } from './use-reviews-list'

interface ReviewCardActionsProps {
  review: NormalizedReview
  onRespond: (review: NormalizedReview) => void
  onFlag: (reviewId: string) => void
  onToggleFeatured: (reviewId: string, featured: boolean) => Promise<void>
}

function ReviewCardActionsComponent({
  review,
  onRespond,
  onFlag,
  onToggleFeatured,
}: ReviewCardActionsProps) {
  const handleRespond = useCallback(() => {
    onRespond(review)
  }, [onRespond, review])

  const handleFlag = useCallback(() => {
    onFlag(review.id)
  }, [onFlag, review.id])

  const handleToggleFeatured = useCallback(async () => {
    await onToggleFeatured(review.id, !review.is_featured)
    toast.success(!review.is_featured ? 'Review featured' : 'Review unfeatured')
  }, [onToggleFeatured, review.id, review.is_featured])

  return (
    <ItemActions>
      <ButtonGroup>
        {!review.response ? (
          <Button size="sm" variant="outline" onClick={handleRespond}>
            <MessageSquare className="mr-2 size-4" aria-hidden="true" />
            Respond
          </Button>
        ) : null}
        {!review.is_flagged ? (
          <Button
            size="sm"
            variant="ghost"
            onClick={handleFlag}
            aria-label="Flag review for moderation"
          >
            <Flag className="size-4" aria-hidden="true" />
          </Button>
        ) : null}
        <Button
          size="sm"
          variant="ghost"
          onClick={handleToggleFeatured}
          aria-label={review.is_featured ? 'Unfeature review' : 'Feature review'}
        >
          <TrendingUp
            className={`size-4 ${review.is_featured ? 'fill-current' : ''}`}
            aria-hidden="true"
          />
        </Button>
      </ButtonGroup>
    </ItemActions>
  )
}

export const ReviewCardActions = memo(ReviewCardActionsComponent)
