'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, History } from 'lucide-react'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'

interface EditWindowAlertProps {
  daysSince: number
}

export function EditWindowAlert({ daysSince }: EditWindowAlertProps) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="size-4" />
      <AlertTitle>Edit window expired</AlertTitle>
      <AlertDescription>
        Reviews can only be edited within 7 days of creation. This review was posted{' '}
        {Math.floor(daysSince)} days ago.
        <ItemGroup className="mt-3 gap-2">
          <Item variant="muted" size="sm">
            <ItemMedia variant="icon">
              <History className="size-4" aria-hidden="true" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Original post</ItemTitle>
              <ItemDescription>{Math.floor(daysSince)} days ago</ItemDescription>
            </ItemContent>
          </Item>
        </ItemGroup>
      </AlertDescription>
    </Alert>
  )
}
