import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Flex } from '@/components/layout'
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
        <Flex gap="xs" className="flex-wrap">
          {salon.specialties.map((specialty: string) => (
            <Badge key={specialty} variant="secondary">
              {specialty}
            </Badge>
          ))}
        </Flex>
      </CardContent>
    </Card>
  )
}
