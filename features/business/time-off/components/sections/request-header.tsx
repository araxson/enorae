'use client'

import { User } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { ItemHeader, ItemTitle, ItemDescription, ItemActions } from '@/components/ui/item'

type RequestHeaderProps = {
  staffName: string | null
  staffTitle: string | null
  status: string | null
}

export function RequestHeader({ staffName, staffTitle, status }: RequestHeaderProps) {
  const statusColor =
    status === 'approved'
      ? 'default'
      : status === 'rejected'
      ? 'destructive'
      : 'secondary'

  return (
    <ItemHeader>
      <div className="flex w-full items-start justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <User className="size-4" aria-hidden="true" />
            <ItemTitle>{staffName || 'Unknown Staff'}</ItemTitle>
          </div>
          {staffTitle && <ItemDescription>{staffTitle}</ItemDescription>}
        </div>
        <ItemActions>
          <Badge variant={statusColor}>{status}</Badge>
        </ItemActions>
      </div>
    </ItemHeader>
  )
}
