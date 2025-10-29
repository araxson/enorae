'use client'

import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Search, Sparkles } from 'lucide-react'
import { listingCopy } from './listing.data'

interface EmptyStateProps {
  onReset: () => void
}

export function EmptyState({ onReset }: EmptyStateProps) {
  return (
    <Empty className="border border-border/50 bg-card/40 py-12">
      <EmptyMedia variant="icon">
        <Search className="size-6" aria-hidden="true" />
      </EmptyMedia>
      <EmptyHeader>
        <EmptyTitle>{listingCopy.emptyTitle}</EmptyTitle>
        <EmptyDescription>{listingCopy.emptyDescription}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" onClick={onReset}>
          <Sparkles className="size-4" aria-hidden="true" />
          {listingCopy.resetLabel}
        </Button>
      </EmptyContent>
    </Empty>
  )
}
