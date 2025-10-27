import { Users, Scissors } from 'lucide-react'

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
} from '@/components/ui/item'
import { cn } from '@/lib/utils'

interface SalonStatsProps {
  staffCount?: number | null
  servicesCount?: number | null
  className?: string
}

export function SalonStats({ staffCount, servicesCount, className }: SalonStatsProps) {
  const hasStats = (staffCount && staffCount > 0) || (servicesCount && servicesCount > 0)

  if (!hasStats) {
    return null
  }

  return (
    <ItemGroup className={cn('flex flex-wrap gap-3', className)}>
      {staffCount && staffCount > 0 && (
        <Item variant="muted">
          <ItemMedia variant="icon">
            <Users className="h-4 w-4 text-muted-foreground" />
          </ItemMedia>
          <ItemContent>
            <ItemDescription>
              {staffCount} {staffCount === 1 ? 'staff member' : 'staff'}
            </ItemDescription>
          </ItemContent>
        </Item>
      )}
      {servicesCount && servicesCount > 0 && (
        <Item variant="muted">
          <ItemMedia variant="icon">
            <Scissors className="h-4 w-4 text-muted-foreground" />
          </ItemMedia>
          <ItemContent>
            <ItemDescription>
              {servicesCount} {servicesCount === 1 ? 'service' : 'services'}
            </ItemDescription>
          </ItemContent>
        </Item>
      )}
    </ItemGroup>
  )
}
