import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock } from 'lucide-react'

type PeakHourCardProps = {
  peakHour: number
}

export function PeakHourCard({ peakHour }: PeakHourCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Peak Hour</CardTitle>
        <CardDescription>Busiest time of day</CardDescription>
      </CardHeader>
      <CardContent className="flex items-start justify-between">
        <p className="text-2xl font-semibold leading-none tracking-tight">{peakHour}:00</p>
        <Clock className="size-4 text-muted-foreground" aria-hidden="true" />
      </CardContent>
    </Card>
  )
}
