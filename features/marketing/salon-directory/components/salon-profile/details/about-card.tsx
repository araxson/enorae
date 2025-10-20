import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import type { Salon } from '../types'

interface AboutCardProps {
  salon: Salon
}

export function AboutCard({ salon }: AboutCardProps) {
  if (!salon.description) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>About</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="leading-7">{salon.description}</p>
      </CardContent>
    </Card>
  )
}
