'use client'

import { format } from 'date-fns'
import {
  MoreVertical,
  Flag,
  FlagOff,
  Star,
  MessageSquare,
  Trash2,
  Eye,
  TrendingUp,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'
import type { ModerationReview } from '@/features/admin/moderation/api/queries'
import { Spinner } from '@/components/ui/spinner'

const DATE_FORMAT = 'MMM d, yyyy'

type ReviewsTableRowProps = {
  review: ModerationReview
  loadingId: string | null
  onFlag: (review: ModerationReview) => void
  onUnflag: (review: ModerationReview) => void
  onToggleFeature: (review: ModerationReview) => void
  onDelete: (review: ModerationReview) => void
  onViewDetail: (review: ModerationReview) => void
}

function sentimentVariant(label: ModerationReview['sentimentLabel']) {
  if (label === 'positive') return 'default' as const
  if (label === 'neutral') return 'secondary' as const
  return 'destructive' as const
}

function riskVariant(label: ModerationReview['fakeLikelihoodLabel']) {
  if (label === 'high') return 'destructive' as const
  if (label === 'medium') return 'default' as const
  return 'outline' as const
}

function reputationVariant(label: ModerationReview['reviewerReputation']['label']) {
  if (label === 'trusted') return 'default' as const
  if (label === 'neutral') return 'secondary' as const
  return 'destructive' as const
}

export function ReviewsTableRow({
  review,
  loadingId,
  onFlag,
  onUnflag,
  onToggleFeature,
  onDelete,
  onViewDetail,
}: ReviewsTableRowProps) {
  const reviewId = review['id'] ?? ''
  const isLoading = loadingId === reviewId

  return (
    <TableRow className={isLoading ? 'relative opacity-60 pointer-events-none' : 'relative'} aria-busy={isLoading}>
      {isLoading && (
        <div className="absolute inset-0 bg-background/70 flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground">
          <Spinner />
          Processing…
        </div>
      )}
      <TableCell>
        <div className="font-medium">{review['salon_name'] || 'Unknown'}</div>
      </TableCell>
      <TableCell>
        <div>
          <div className="font-medium">{review['customer_name'] || 'Anonymous'}</div>
          <div className="text-sm text-muted-foreground">{review['customer_email']}</div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <Star className="size-4 text-accent" fill="currentColor" />
          <span className="font-medium">{review['rating']}</span>
        </div>
      </TableCell>
      <TableCell className="max-w-md">
        {review['comment'] ? (
          <p className="text-sm truncate">{review['comment']}</p>
        ) : (
          <Badge variant="outline">No comment provided</Badge>
        )}
        <p className="text-xs text-muted-foreground">{review.commentLength} chars</p>
      </TableCell>
      <TableCell>
        <div className="flex flex-col gap-1">
          <Badge variant={sentimentVariant(review.sentimentLabel)}>
            {review.sentimentLabel} ({review.sentimentScore})
          </Badge>
          {review['has_response'] && (
            <div className="flex items-center gap-1">
              <MessageSquare className="size-3" />
              <Badge variant="outline">Responded</Badge>
            </div>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-col gap-1">
          <Badge variant={riskVariant(review.fakeLikelihoodLabel)}>
            Risk {review.fakeLikelihoodScore}
          </Badge>
          <div className="flex items-center gap-1">
            <TrendingUp className="size-3" />
            <Badge variant={review.qualityLabel === 'low' ? 'destructive' : 'secondary'}>
              Quality {review.qualityScore}
            </Badge>
          </div>
          {review['is_flagged'] && (
            <div className="flex items-center gap-1">
              <Flag className="size-3" />
              <Badge variant="destructive">Flagged</Badge>
            </div>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-col gap-1">
          <Badge variant={reputationVariant(review.reviewerReputation.label)}>
            {review.reviewerReputation.label}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {review.reviewerReputation.totalReviews} reviews · {review.reviewerReputation.flaggedReviews} flagged
          </span>
        </div>
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {review['created_at'] ? format(new Date(review['created_at']), DATE_FORMAT) : 'N/A'}
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" disabled={isLoading}>
              <MoreVertical className="size-4" />
              <span className="sr-only">Review actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onViewDetail(review)}>
              <Eye className="mr-2 size-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {review['is_flagged'] ? (
              <DropdownMenuItem onClick={() => onUnflag(review)}>
                <FlagOff className="mr-2 size-4" />
                Unflag
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => onFlag(review)}>
                <Flag className="mr-2 size-4" />
                Flag
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => onToggleFeature(review)}>
              <Star className="mr-2 size-4" />
              {review['is_featured'] ? 'Unfeature' : 'Feature'}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onDelete(review)}>
              <Trash2 className="mr-2 size-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
}
