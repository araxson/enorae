import { Calendar } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

type BusiestDayCardProps = {
  busiestDay: number
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export function BusiestDayCard({ busiestDay }: BusiestDayCardProps) {
  const busiestDayName = DAY_NAMES[busiestDay] || 'Unknown'

  return (
    <Card>
      <CardHeader>
        <CardTitle>Busiest Day</CardTitle>
        <CardDescription>Highest demand day</CardDescription>
      </CardHeader>
      <CardContent className="flex items-start justify-between">
        <p className="text-2xl font-semibold leading-none tracking-tight">{busiestDayName}</p>
        <Calendar className="size-4 text-muted-foreground" aria-hidden="true" />
      </CardContent>
    </Card>
  )
}
