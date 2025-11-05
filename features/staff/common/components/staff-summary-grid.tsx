import { Badge } from '@/components/ui/badge'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import type { StaffSummary } from '../api/types'

const toneBadge: Record<
  Required<StaffSummary>['tone'],
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
> = {
  default: { label: 'On track', variant: 'outline' },
  success: { label: 'Ahead', variant: 'default' },
  warning: { label: 'Watch', variant: 'destructive' },
  info: { label: 'Info', variant: 'secondary' },
}

interface StaffSummaryGridProps {
  summaries?: readonly StaffSummary[]
}

export function StaffSummaryGrid({ summaries }: StaffSummaryGridProps) {
  if (!summaries || summaries.length === 0) {
    return null
  }

  return (
    <ItemGroup className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {summaries.map((summary) => {
        const Icon = summary.icon
        const tone = summary.tone ?? 'default'
        const badge = toneBadge[tone]
        return (
          <Item key={summary.id} variant="outline" size="sm">
            <ItemHeader>
              <div className="text-sm font-medium text-muted-foreground">{summary.label}</div>
              <ItemActions className="gap-1">
                {tone !== 'default' ? (
                  <Badge variant={badge.variant}>{badge.label}</Badge>
                ) : null}
                {Icon ? <Icon className="size-4" aria-hidden /> : null}
              </ItemActions>
            </ItemHeader>
            <ItemContent className="space-y-1">
              <ItemTitle className="text-2xl font-semibold leading-tight">{summary.value}</ItemTitle>
              {summary.helper ? <ItemDescription>{summary.helper}</ItemDescription> : null}
            </ItemContent>
          </Item>
        )
      })}
    </ItemGroup>
  )
}
