'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

type ServiceStats = {
  total: number
  completed: number
  inProgress: number
  pending: number
  cancelled: number
}

type ServiceCompletionCardProps = {
  stats: ServiceStats
}

export function ServiceCompletionCard({ stats }: ServiceCompletionCardProps) {
  const completionRate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Completion</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span className="font-medium">{Math.round(completionRate)}%</span>
          </div>
          <Progress value={completionRate} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { label: 'Completed', value: stats.completed },
            { label: 'In Progress', value: stats.inProgress },
            { label: 'Pending', value: stats.pending },
            { label: 'Cancelled', value: stats.cancelled },
          ].map((item) => (
            <Card key={item.label}>
              <CardHeader>
                <CardTitle>{item.value}</CardTitle>
                <CardDescription>{item.label}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
