import { Calendar } from 'lucide-react'
import { CardHeader } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'

interface BookingHeaderProps {
  salonName: string
  progress: number
}

export function BookingHeader({ salonName, progress }: BookingHeaderProps) {
  return (
    <CardHeader className="space-y-4">
      <ItemGroup>
        <Item>
          <ItemMedia variant="icon">
            <Calendar className="h-5 w-5" aria-hidden="true" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Book an appointment</ItemTitle>
            <ItemDescription>{salonName}</ItemDescription>
          </ItemContent>
        </Item>
      </ItemGroup>
      <div className="space-y-2">
        <ItemGroup>
          <Item>
            <ItemContent>
              <ItemTitle>Progress</ItemTitle>
            </ItemContent>
            <ItemActions className="flex-none">
              <ItemDescription>{progress}% complete</ItemDescription>
            </ItemActions>
          </Item>
        </ItemGroup>
        <Progress value={progress} className="h-2" />
      </div>
    </CardHeader>
  )
}
