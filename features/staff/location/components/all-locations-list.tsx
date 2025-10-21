import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin } from 'lucide-react'
import type { StaffLocationDetail } from '../types'

interface AllLocationsListProps {
  locations: StaffLocationDetail[]
  currentLocationId?: string | null
}

export function AllLocationsList({ locations, currentLocationId }: AllLocationsListProps) {
  if (locations.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-sm text-muted-foreground">No locations found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
      {locations.map((location) => {
        const isCurrent = location.id === currentLocationId
        const address = [
          location.address_line1,
          location.city,
          location.state_province,
        ].filter(Boolean).join(', ')

        return (
          <Card key={location.id}>
            <CardHeader className="p-4 pb-2">
              <div className="flex gap-3 items-center flex-wrap">
                <CardTitle>
                  {location.location_name || location.name}
                </CardTitle>
                {isCurrent && <Badge variant="default" className="text-xs">Your Location</Badge>}
                {location.is_primary && <Badge variant="outline" className="text-xs">Primary</Badge>}
              </div>
            </CardHeader>
            {(address || location.phone_number) && (
              <CardContent className="p-4 pt-0">
                <div className="flex flex-col gap-3">
                  {address && (
                    <div className="flex gap-3 items-start">
                      <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">{address}</p>
                    </div>
                  )}
                  {location.phone_number && (
                    <p className="text-sm text-muted-foreground">
                      {location.phone_number}
                    </p>
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        )
      })}
    </div>
  )
}
