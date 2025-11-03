import { AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { CancellationPattern } from '@/features/admin/appointments/api/types'
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
    <div className="h-full">
      <Card>
        <CardHeader>
          <div className="pb-4">
            <ItemGroup>
              <Item variant="muted">
                <ItemMedia variant="icon">
                  <AlertTriangle className="size-4" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>Cancellation Patterns</ItemTitle>
                </ItemContent>
              </Item>
            </ItemGroup>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {patterns.length === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyTitle>No cancellation hotspots detected</EmptyTitle>
                  <EmptyDescription>
                    Patterns display once salons accumulate notable cancellation trends.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <div className="space-y-2">
                <ItemGroup>
                  {patterns.slice(0, 6).map((pattern) => (
                    <Item key={pattern.label} variant="outline">
                      <ItemContent>
                        <div className="flex flex-col items-start gap-2">
                          <ItemTitle>{pattern.label}</ItemTitle>
                          <ItemDescription>{pattern.description}</ItemDescription>
                        </div>
                      </ItemContent>
                      <ItemActions>
                        <Badge variant="outline">
                          {pattern.count} · {formatPercent(pattern.share)}
                        </Badge>
                      </ItemActions>
                    </Item>
                  ))}
                </ItemGroup>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
