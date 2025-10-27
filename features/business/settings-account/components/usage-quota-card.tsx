import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'
import type { UsageQuota } from '../types'
import { Progress } from '@/components/ui/progress'

export function UsageQuotaCard({ quotas }: { quotas: UsageQuota[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Usage & Quotas</CardTitle>
        <CardDescription>Current usage against your plan limits</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {quotas.map((quota) => {
          const percentage = (quota.used / quota.limit) * 100
          const isNearLimit = percentage >= 80

          return (
            <div key={quota.name}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium">{quota.name}</span>
                  <span className="text-sm">
                    {quota.used} / {quota.limit} {quota.unit}
                  </span>
                </div>
                <Progress
                  value={Math.min(percentage, 100)}
                  className={`h-2 ${isNearLimit ? 'bg-destructive/10' : ''}`}
                />
                {isNearLimit && (
                  <div className="mt-1 flex items-center gap-4">
                    <AlertCircle className="h-3 w-3 text-destructive" />
                    <p className="text-xs text-muted-foreground text-destructive">
                      Approaching limit - consider upgrading
                    </p>
                  </div>
                )}
              </div>
            )
          })}
      </CardContent>
    </Card>
  )
}
