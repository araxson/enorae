import { Badge } from '@/components/ui/badge'
import { Wifi, Car, Accessibility, Coffee, CreditCard, DollarSign } from 'lucide-react'
import { cn } from "@/lib/utils";

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
    <div className={cn('flex gap-2 items-center', className)}>
      {displayAmenities.map((amenity) => {
        const Icon = AMENITY_ICONS[amenity]
        return (
          <Badge key={amenity} variant="secondary" className="gap-1">
            {Icon && <Icon className="h-3 w-3" />}
            {amenity}
          </Badge>
        )
      })}
      {hasMore && (
        <Badge variant="outline">
          +{amenities.length - limit!} more
        </Badge>
      )}
    </div>
  )
}
