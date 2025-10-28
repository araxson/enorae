import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
              <div className="flex items-center justify-between gap-3">
                <CardDescription>{summary.label}</CardDescription>
                {Icon ? <Icon className="size-4" aria-hidden /> : null}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <CardTitle>{summary.value}</CardTitle>
                {summary.helper ? <CardDescription>{summary.helper}</CardDescription> : null}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
