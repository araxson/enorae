import { AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { CancellationPattern } from '@/features/admin/appointments/types'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'

interface CancellationPatternsCardProps {
  patterns: CancellationPattern[]
}

const formatPercent = (value: number) => `${(value * 100).toFixed(1)}%`

export function CancellationPatternsCard({ patterns }: CancellationPatternsCardProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <ItemGroup>
          <Item variant="muted">
            <ItemMedia variant="icon">
              <AlertTriangle className="h-4 w-4" />
            </ItemMedia>
            <ItemContent>
              <CardTitle>Cancellation Patterns</CardTitle>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent className="space-y-3">
        {patterns.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No cancellation hotspots detected</EmptyTitle>
              <EmptyDescription>Patterns display once salons accumulate notable cancellation trends.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ItemGroup className="space-y-2">
            {patterns.slice(0, 6).map((pattern) => (
              <Item key={pattern.label} variant="outline" className="flex-col items-start gap-2">
                <ItemContent>
                  <ItemTitle>{pattern.label}</ItemTitle>
                  <ItemDescription>{pattern.description}</ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Badge variant="outline">
                    {pattern.count} · {formatPercent(pattern.share)}
                  </Badge>
                </ItemActions>
              </Item>
            ))}
          </ItemGroup>
        )}
      </CardContent>
    </Card>
  )
}
