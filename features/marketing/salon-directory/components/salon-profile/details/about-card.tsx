import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { P } from '@/components/ui/typography'
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
        <P>{salon.description}</P>
      </CardContent>
    </Card>
  )
}
