'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, Calendar } from 'lucide-react'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'

type RescheduleAlertsProps = {
  error: string | null
}

export function RescheduleAlerts({ error }: RescheduleAlertsProps) {
  return (
    <div className="space-y-4">
      <Alert>
        <AlertCircle className="size-4" />
        <AlertTitle>Reschedule request</AlertTitle>
        <AlertDescription>
          Your reschedule request will be sent to the salon for approval. You&apos;ll be
          notified once they respond.
          <ItemGroup className="mt-3 gap-2">
            <Item variant="muted" size="sm">
              <ItemMedia variant="icon">
                <Calendar className="size-4" aria-hidden="true" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Salon review</ItemTitle>
                <ItemDescription>We forward your preferred time to the salon instantly.</ItemDescription>
              </ItemContent>
            </Item>
            <Item variant="muted" size="sm">
              <ItemMedia variant="icon">
                <AlertCircle className="size-4" aria-hidden="true" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Status updates</ItemTitle>
                <ItemDescription>We&apos;ll notify you as soon as the salon confirms or suggests alternatives.</ItemDescription>
              </ItemContent>
            </Item>
          </ItemGroup>
        </AlertDescription>
      </Alert>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertTitle>Submission failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
