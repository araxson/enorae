import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { CheckCircle, Sparkles } from 'lucide-react'
import type { Salon } from '../types'

interface AmenitiesCardProps {
  salon: Salon
}

export function AmenitiesCard({ salon }: AmenitiesCardProps) {
  if (!salon.amenities && !salon.features) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Amenities & Features</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
          {salon.amenities?.map((amenity: string) => (
            <div key={amenity} className="flex gap-2 items-center">
              <CheckCircle className="h-4 w-4 text-success" />
              <p className="text-sm text-muted-foreground">{amenity}</p>
            </div>
          ))}
          {salon.features?.map((feature: string) => (
            <div key={feature} className="flex gap-2 items-center">
              <Sparkles className="h-4 w-4 text-primary" />
              <p className="text-sm text-muted-foreground">{feature}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
