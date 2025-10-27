import { Wifi, Car, Accessibility, Coffee, CreditCard, DollarSign } from 'lucide-react'

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
} from '@/components/ui/item'
import { cn } from '@/lib/utils'

interface AmenitiesBadgesProps {
  amenities: string[] | null
  limit?: number
  className?: string
}

const AMENITY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'WiFi': Wifi,
  'Parking': Car,
  'Wheelchair Accessible': Accessibility,
  'Refreshments': Coffee,
  'Credit Cards': CreditCard,
  'Cash': DollarSign,
}

export function AmenitiesBadges({ amenities, limit, className }: AmenitiesBadgesProps) {
  if (!amenities || amenities.length === 0) {
    return null
  }

  const displayAmenities = limit ? amenities.slice(0, limit) : amenities
  const hasMore = limit && amenities.length > limit

  return (
    <ItemGroup className={cn('flex flex-wrap gap-2', className)}>
      {displayAmenities.map((amenity) => {
        const Icon = AMENITY_ICONS[amenity]
        return (
          <Item key={amenity} variant="muted">
            {Icon && (
              <ItemMedia variant="icon">
                <Icon className="h-3 w-3" />
              </ItemMedia>
            )}
            <ItemContent>
              <ItemDescription>{amenity}</ItemDescription>
            </ItemContent>
          </Item>
        )
      })}
      {hasMore && (
        <Item variant="muted">
          <ItemContent>
            <ItemDescription>+{amenities.length - limit!} more</ItemDescription>
          </ItemContent>
        </Item>
      )}
    </ItemGroup>
  )
}
