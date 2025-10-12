import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { StaffSummary } from './types'

const toneClasses: Record<Required<StaffSummary>['tone'], string> = {
  default: 'border-border',
  success: 'border-emerald-500/60 dark:border-emerald-500/50',
  warning: 'border-amber-500/60 dark:border-amber-500/50',
  info: 'border-sky-500/60 dark:border-sky-500/50',
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
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-sm font-medium text-muted-foreground">
                <span>{summary.label}</span>
                {Icon ? <Icon className="h-4 w-4 text-foreground" /> : null}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-2xl font-semibold tracking-tight">{summary.value}</p>
              {summary.helper ? <p className="text-xs text-muted-foreground">{summary.helper}</p> : null}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

