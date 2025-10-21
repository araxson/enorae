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
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-muted-foreground" />
          <CardTitle>Feature Usage Signals</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">No feature usage telemetry returned.</p>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <Card key={item.key}>
                <CardContent className="flex items-center justify-between p-3">
                  <span className="text-sm font-medium">{item.key}</span>
                  <span className="text-xs text-muted-foreground">{item.count.toLocaleString('en-US')} hits</span>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
