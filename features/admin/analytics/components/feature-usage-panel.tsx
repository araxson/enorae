import { Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { PlatformAnalyticsSnapshot } from '../api/admin-analytics-types'

interface FeatureUsagePanelProps {
  featureUsage: PlatformAnalyticsSnapshot['featureUsage']
}

export function FeatureUsagePanel({ featureUsage }: FeatureUsagePanelProps) {
  const items = featureUsage.items.slice(0, 10)

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Sparkles className="h-4 w-4 text-muted-foreground" />
          Feature Usage Signals
        </CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">No feature usage telemetry returned.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {items.map((item) => (
              <li key={item.key} className="flex items-center justify-between rounded-md border p-2">
                <span className="font-medium text-foreground">{item.key}</span>
                <span className="text-xs text-muted-foreground">{item.count.toLocaleString('en-US')} hits</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
