import { Clock } from 'lucide-react'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'

interface AppointmentInfoSectionProps {
  startTime: string | null
  endTime: string | null
  durationMinutes: number | null
  staffName: string | null
}

export function AppointmentInfoSection({
  startTime,
  endTime,
  durationMinutes,
  staffName,
}: AppointmentInfoSectionProps) {
  return (
    <ItemGroup className="gap-4">
      <Item variant="outline" size="sm">
        <ItemContent>
          <ItemDescription>Date &amp; time</ItemDescription>
          <ItemTitle>
            {startTime &&
              new Date(startTime).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
          </ItemTitle>
          <ItemDescription>
            {startTime &&
              new Date(startTime).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            {' — '}
            {endTime &&
              new Date(endTime).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              })}
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="size-4" />
            <span>{durationMinutes || 0} minutes total</span>
          </div>
        </ItemActions>
      </Item>

      {staffName ? (
        <Item variant="outline" size="sm">
          <ItemContent>
            <ItemDescription>Staff member</ItemDescription>
            <ItemTitle>{staffName}</ItemTitle>
          </ItemContent>
        </Item>
      ) : null}
    </ItemGroup>
  )
}
