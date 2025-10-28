'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'

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
        <ItemGroup>
          <Item>
            <ItemContent>
              <ItemTitle>Service Completion</ItemTitle>
            </ItemContent>
          </Item>
        </ItemGroup>
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
                <ItemGroup>
                  <Item className="flex-col items-center gap-1">
                    <ItemContent>
                      <ItemTitle>{item.value}</ItemTitle>
                    </ItemContent>
                    <ItemContent>
                      <ItemDescription>{item.label}</ItemDescription>
                    </ItemContent>
                  </Item>
                </ItemGroup>
              </CardHeader>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
