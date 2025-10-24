import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { StaffSummary } from './types'

const toneClasses: Record<Required<StaffSummary>['tone'], string> = {
  default: 'border-border',
  success: 'border-primary',
  warning: 'border-accent',
  info: 'border-secondary',
}

interface StaffSummaryGridProps {
  summaries?: readonly StaffSummary[]
}

export function StaffSummaryGrid({ summaries }: StaffSummaryGridProps) {
  if (!summaries || summaries.length === 0) {
    return null
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {summaries.map((summary) => {
        const Icon = summary.icon
        const tone = summary.tone ?? 'default'
        return (
          <Card
            key={summary.id}
            className={cn('border-l-4', toneClasses[tone])}
          >
            <CardHeader>
              <div className="flex flex-row items-center justify-between space-y-0 pb-3">
                <div className="text-sm font-medium text-muted-foreground">
                  {summary.label}
                </div>
                {Icon ? <Icon className="h-4 w-4" /> : null}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-2xl font-semibold">{summary.value}</p>
                {summary.helper ? <p className="text-xs text-muted-foreground">{summary.helper}</p> : null}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
