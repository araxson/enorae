import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { getStatusVariant } from './utils'
import type { AppointmentDetailContentProps } from './types'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { Check } from 'lucide-react'

export function AppointmentHeader({ appointment }: Pick<AppointmentDetailContentProps, 'appointment'>) {
  if (!appointment) return null
  const statusLabel = (appointment['status'] ?? 'pending')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
  const scheduledDate = appointment['start_time'] ? new Date(appointment['start_time']) : null

  return (
    <>
      <ItemGroup>
        <Item>
          <ItemMedia variant="icon">
            <Check className="h-4 w-4" aria-hidden="true" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Confirmation</ItemTitle>
            <ItemDescription>{appointment['confirmation_code'] || 'No code'}</ItemDescription>
            {scheduledDate ? (
              <ItemDescription>
                Scheduled for{' '}
                <time dateTime={appointment['start_time'] ?? undefined}>
                  {scheduledDate.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}{' '}
                  {scheduledDate.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </time>
              </ItemDescription>
            ) : null}
          </ItemContent>
          <ItemActions className="flex-none">
            <Badge variant={getStatusVariant(appointment['status'])}>{statusLabel}</Badge>
          </ItemActions>
        </Item>
      </ItemGroup>
      <Separator />
    </>
  )
}
