import { Wifi, Car, Accessibility, Coffee, CreditCard, DollarSign } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
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
    <div className={cn('flex flex-wrap gap-2', className)}>
      {displayAmenities.map((amenity) => {
        const Icon = AMENITY_ICONS[amenity]
        return (
          <Badge key={amenity} variant="secondary">
            <span className="flex items-center gap-2">
              {Icon ? <Icon className="size-3" aria-hidden="true" /> : null}
              <span>{amenity}</span>
            </span>
          </Badge>
        )
      })}
      {hasMore ? (
        <Badge variant="secondary">
          <span>+{amenities.length - limit!} more</span>
        </Badge>
      ) : null}
    </div>
  )
}
