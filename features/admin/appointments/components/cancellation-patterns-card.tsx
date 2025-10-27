import { AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { CancellationPattern } from '@/features/admin/appointments/types'

interface CancellationPatternsCardProps {
  patterns: CancellationPattern[]
}

const formatPercent = (value: number) => `${(value * 100).toFixed(1)}%`

export function CancellationPatternsCard({ patterns }: CancellationPatternsCardProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-accent" />
          <CardTitle>Cancellation Patterns</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {patterns.length === 0 ? (
          <p className="text-sm text-muted-foreground">No cancellation hotspots detected.</p>
        ) : (
          <div className="space-y-2">
            {patterns.slice(0, 6).map((pattern) => (
              <Card key={pattern.label}>
                <CardHeader className="pb-2">
                  <CardTitle>{pattern.label}</CardTitle>
                  <CardDescription>{pattern.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Badge variant="outline">
                    {pattern.count} · {formatPercent(pattern.share)}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
