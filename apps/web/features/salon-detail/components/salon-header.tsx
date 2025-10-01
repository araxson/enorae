import { Card, CardContent, CardHeader, CardTitle } from '@enorae/ui'
import type { Salon } from '../types/salon.types'

interface SalonHeaderProps {
  salon: Salon
}

export function SalonHeader({ salon }: SalonHeaderProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-4xl">{salon.name}</CardTitle>
        {salon.business_name && (
          <p className="text-muted-foreground">{salon.business_name}</p>
        )}
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{salon.business_type}</p>
      </CardContent>
    </Card>
  )
}