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
import type { ModerationReview } from '../api/queries'
import type { ReviewActions } from './reviews-table.types'

const DATE_FORMAT = 'MMM d, yyyy'

type ReviewsTableRowProps = {
  review: ModerationReview
  actions: ReviewActions
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

export function ReviewsTableRow({ review, actions, onViewDetail }: ReviewsTableRowProps) {
  return (
    <TableRow>
      <TableCell>
        <div className="font-medium">{review.salon_name || 'Unknown'}</div>
      </TableCell>
      <TableCell>
        <div>
          <div className="font-medium">{review.customer_name || 'Anonymous'}</div>
          <div className="text-sm text-muted-foreground">{review.customer_email}</div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="font-medium">{review.rating}</span>
        </div>
      </TableCell>
      <TableCell className="max-w-md">
        <p className="text-sm truncate">{review.comment || 'No text'}</p>
        <p className="text-xs text-muted-foreground">{review.commentLength} chars</p>
      </TableCell>
      <TableCell>
        <div className="flex flex-col gap-1">
          <Badge variant={sentimentVariant(review.sentimentLabel)}>
            {review.sentimentLabel} ({review.sentimentScore})
          </Badge>
          {review.has_response && (
            <Badge variant="outline" className="gap-1">
              <MessageSquare className="h-3 w-3" />
              Responded
            </Badge>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-col gap-1">
          <Badge variant={riskVariant(review.fakeLikelihoodLabel)}>
            Risk {review.fakeLikelihoodScore}
          </Badge>
          <Badge variant={review.qualityLabel === 'low' ? 'destructive' : 'secondary'} className="gap-1">
            <TrendingUp className="h-3 w-3" />
            Quality {review.qualityScore}
          </Badge>
          {review.is_flagged && (
            <Badge variant="destructive" className="gap-1">
              <Flag className="h-3 w-3" />
              Flagged
            </Badge>
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
        {review.created_at ? format(new Date(review.created_at), DATE_FORMAT) : 'N/A'}
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" disabled={actions.loadingId === review.id}>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onViewDetail(review)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {review.is_flagged ? (
              <DropdownMenuItem onClick={() => actions.unflag(review.id!)}>
                <FlagOff className="mr-2 h-4 w-4" />
                Unflag
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => actions.flag(review.id!)}>
                <Flag className="mr-2 h-4 w-4" />
                Flag
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => actions.toggleFeature(review.id!, review.is_featured || false)}>
              <Star className="mr-2 h-4 w-4" />
              {review.is_featured ? 'Unfeature' : 'Feature'}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => actions.remove(review.id!)} variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
}
