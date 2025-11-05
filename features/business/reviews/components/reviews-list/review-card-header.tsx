'use client'


import { CheckCircle2, Flag, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { ItemTitle } from '@/components/ui/item'
import { Field, FieldContent, FieldDescription } from '@/components/ui/field'

interface ReviewCardHeaderProps {
  customerName: string | null
  isVerified: boolean | null
  isFeatured: boolean | null
  isFlagged: boolean | null
  rating: number | null
  createdAt: string | null
  renderStars: (rating: number | null) => React.ReactNode
  formatDate: (date: string | null) => string
}

function ReviewCardHeaderComponent({
  customerName,
  isVerified,
  isFeatured,
  isFlagged,
  rating,
  createdAt,
  renderStars,
  formatDate,
}: ReviewCardHeaderProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <ItemTitle>{customerName || 'Anonymous'}</ItemTitle>
        {isVerified && (
          <div className="flex items-center gap-1 text-xs">
            <CheckCircle2 className="size-3" aria-hidden="true" />
            <Badge variant="outline">Verified</Badge>
          </div>
        )}
        {isFeatured && (
          <div className="flex items-center gap-1 text-xs">
            <TrendingUp className="size-3" aria-hidden="true" />
            <Badge variant="default">Featured</Badge>
          </div>
        )}
        {isFlagged && (
          <div className="flex items-center gap-1 text-xs">
            <Flag className="size-3" aria-hidden="true" />
            <Badge variant="destructive">Flagged</Badge>
          </div>
        )}
      </div>
      <Field>
        <FieldContent className="flex items-center gap-4">
          {renderStars(rating)}
          <FieldDescription>{formatDate(createdAt)}</FieldDescription>
        </FieldContent>
      </Field>
    </div>
  )
}

export const ReviewCardHeader = ReviewCardHeaderComponent
