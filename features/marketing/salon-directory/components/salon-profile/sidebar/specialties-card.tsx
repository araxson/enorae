import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Salon } from '../types'

interface SpecialtiesCardProps {
  salon: Salon
}

export function SpecialtiesCard({ salon }: SpecialtiesCardProps) {
  if (!salon.specialties?.length) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Specialties</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 flex-wrap">
          {salon.specialties.map((specialty: string) => (
            <Badge key={specialty} variant="secondary">
              {specialty}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
