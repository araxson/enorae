import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Grid, Group } from '@/components/layout'
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
        <Grid cols={{ base: 2, md: 3 }} gap="md">
          {salon.amenities?.map((amenity: string) => (
            <Group gap="xs" key={amenity}>
              <CheckCircle className="h-4 w-4 text-green-600" />
              <p className="text-sm text-muted-foreground">{amenity}</p>
            </Group>
          ))}
          {salon.features?.map((feature: string) => (
            <Group gap="xs" key={feature}>
              <Sparkles className="h-4 w-4 text-primary" />
              <p className="text-sm text-muted-foreground">{feature}</p>
            </Group>
          ))}
        </Grid>
      </CardContent>
    </Card>
  )
}
