import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { Salon } from '@/features/marketing/salon-directory/components/salon-profile/types'

interface AboutCardProps {
  salon: Salon
}

export function AboutCard({ salon }: AboutCardProps) {
  const description = salon.full_description || salon.short_description
  if (!description) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>About</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  )
}
