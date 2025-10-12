import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Stack, Group } from '@/components/layout'
import { Muted } from '@/components/ui/typography'
import { Tag, Users, Calendar } from 'lucide-react'
import type { Salon } from '../types'

interface QuickStatsCardProps {
  salon: Salon
}

export function QuickStatsCard({ salon }: QuickStatsCardProps) {
  if (
    salon.services_count === null &&
    salon.staff_count === null &&
    !salon.established_at
  ) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <Stack gap="md">
          {salon.services_count !== null && (
            <Group gap="sm">
              <Tag className="h-5 w-5 text-muted-foreground" />
              <Muted>{salon.services_count} Services</Muted>
            </Group>
          )}
          {salon.staff_count !== null && (
            <Group gap="sm">
              <Users className="h-5 w-5 text-muted-foreground" />
              <Muted>{salon.staff_count} Staff Members</Muted>
            </Group>
          )}
          {salon.established_at && (
            <Group gap="sm">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <Muted>Established {new Date(salon.established_at).getFullYear()}</Muted>
            </Group>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}
