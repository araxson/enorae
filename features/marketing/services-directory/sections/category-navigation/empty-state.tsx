'use client'

import { Badge } from '@/components/ui/badge'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'

export function EmptyState() {
  return (
    <Empty className="border border-border/60 bg-card/40">
      <EmptyHeader>
        <EmptyTitle>No categories available yet</EmptyTitle>
        <EmptyDescription>
          New service categories will appear once salons publish their offerings.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Badge variant="secondary">Check back soon</Badge>
      </EmptyContent>
    </Empty>
  )
}
