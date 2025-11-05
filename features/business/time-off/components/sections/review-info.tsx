'use client'

import { Separator } from '@/components/ui/separator'
import { ItemDescription } from '@/components/ui/item'
import { format } from 'date-fns'

type ReviewInfoProps = {
  reviewedAt: string | null
  reviewedByName: string | null
  reviewNotes: string | null
}

export function ReviewInfo({ reviewedAt, reviewedByName, reviewNotes }: ReviewInfoProps) {
  if (!reviewedAt || !reviewedByName) return null

  return (
    <>
      <Separator />
      <div className="flex flex-col gap-1">
        <ItemDescription>
          Reviewed by {reviewedByName} on{' '}
          {format(new Date(reviewedAt), 'MMM dd, yyyy')}
        </ItemDescription>
        {reviewNotes && <span>{reviewNotes}</span>}
      </div>
    </>
  )
}
