import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { StaffSummary } from './types'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'

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
              <Item variant="muted" size="sm">
                <ItemContent>
                  <ItemDescription>{summary.label}</ItemDescription>
                </ItemContent>
                {Icon ? (
                  <ItemMedia variant="icon">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </ItemMedia>
                ) : null}
              </Item>
            </CardHeader>
            <CardContent>
              <ItemContent>
                <ItemTitle>
                  <div className="text-2xl font-semibold">{summary.value}</div>
                </ItemTitle>
                {summary.helper ? (
                  <ItemDescription>{summary.helper}</ItemDescription>
                ) : null}
              </ItemContent>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
