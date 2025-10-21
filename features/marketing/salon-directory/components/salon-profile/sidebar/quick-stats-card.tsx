import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
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
        <div className="flex flex-col gap-4">
          {salon.services_count !== null && (
            <div className="flex gap-3 items-center">
              <Tag className="h-5 w-5 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">{salon.services_count} Services</p>
            </div>
          )}
          {salon.staff_count !== null && (
            <div className="flex gap-3 items-center">
              <Users className="h-5 w-5 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">{salon.staff_count} Staff Members</p>
            </div>
          )}
          {salon.established_at && (
            <div className="flex gap-3 items-center">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Established {new Date(salon.established_at).getFullYear()}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
