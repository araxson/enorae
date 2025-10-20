import { AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { CancellationPattern } from '../api/types'

interface CancellationPatternsCardProps {
  patterns: CancellationPattern[]
}

const formatPercent = (value: number) => `${(value * 100).toFixed(1)}%`

export function CancellationPatternsCard({ patterns }: CancellationPatternsCardProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <CardTitle>Cancellation Patterns</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {patterns.length === 0 ? (
          <p className="text-sm text-muted-foreground">No cancellation hotspots detected.</p>
        ) : (
          <ul className="space-y-2">
            {patterns.slice(0, 6).map((pattern) => (
              <li key={pattern.label} className="flex items-start justify-between gap-3 rounded-md border p-3">
                <div>
                  <p className="font-medium text-foreground">{pattern.label}</p>
                  <p className="text-xs text-muted-foreground">{pattern.description}</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {pattern.count} · {formatPercent(pattern.share)}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
