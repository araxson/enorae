'use client'

import { useState } from 'react'
import { MoreVertical, Flag, FlagOff, Star, MessageSquare, Trash2, Eye } from 'lucide-react'
import { format } from 'date-fns'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { flagReview, unflagReview, deleteReview, featureReview } from '../api/mutations'

type Review = {
  id: string
  salon_name?: string | null
  customer_name?: string | null
  customer_email?: string | null
  rating: number
  review_text?: string | null
  is_flagged: boolean
  flagged_reason?: string | null
  response?: string | null
  is_featured: boolean
  created_at: string
}

type ReviewsTableProps = {
  reviews: Review[]
  onViewDetail: (review: Review) => void
}

export function ReviewsTable({ reviews, onViewDetail }: ReviewsTableProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null)

  async function handleFlag(reviewId: string) {
    const reason = prompt('Enter reason for flagging this review:')
    if (!reason) return

    setLoadingId(reviewId)
    const formData = new FormData()
    formData.append('reviewId', reviewId)
    formData.append('reason', reason)

    const result = await flagReview(formData)
    setLoadingId(null)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('The review has been flagged for moderation.')
    }
  }

  async function handleUnflag(reviewId: string) {
    setLoadingId(reviewId)
    const formData = new FormData()
    formData.append('reviewId', reviewId)

    const result = await unflagReview(formData)
    setLoadingId(null)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('The flag has been removed from this review.')
    }
  }

  async function handleToggleFeature(reviewId: string, isFeatured: boolean) {
    setLoadingId(reviewId)
    const formData = new FormData()
    formData.append('reviewId', reviewId)
    formData.append('isFeatured', (!isFeatured).toString())

    const result = await featureReview(formData)
    setLoadingId(null)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(
        isFeatured ? 'The review is no longer featured.' : 'The review has been featured.'
      )
    }
  }

  async function handleDelete(reviewId: string) {
    if (!confirm('Are you sure you want to delete this review?')) return

    setLoadingId(reviewId)
    const formData = new FormData()
    formData.append('reviewId', reviewId)

    const result = await deleteReview(formData)
    setLoadingId(null)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('The review has been deleted.')
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Salon</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Review</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reviews.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground">
                No reviews found
              </TableCell>
            </TableRow>
          ) : (
            reviews.map((review) => (
              <TableRow key={review.id}>
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
                  <p className="text-sm truncate">{review.review_text || 'No text'}</p>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    {review.is_flagged && (
                      <Badge variant="destructive" className="gap-1">
                        <Flag className="h-3 w-3" />
                        Flagged
                      </Badge>
                    )}
                    {review.is_featured && (
                      <Badge variant="default" className="gap-1">
                        <Star className="h-3 w-3" />
                        Featured
                      </Badge>
                    )}
                    {review.response && (
                      <Badge variant="outline" className="gap-1">
                        <MessageSquare className="h-3 w-3" />
                        Responded
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {format(new Date(review.created_at), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" disabled={loadingId === review.id}>
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
                        <DropdownMenuItem onClick={() => handleUnflag(review.id)}>
                          <FlagOff className="mr-2 h-4 w-4" />
                          Unflag
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => handleFlag(review.id)}>
                          <Flag className="mr-2 h-4 w-4" />
                          Flag
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => handleToggleFeature(review.id, review.is_featured)}
                      >
                        <Star className="mr-2 h-4 w-4" />
                        {review.is_featured ? 'Unfeature' : 'Feature'}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleDelete(review.id)} className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
