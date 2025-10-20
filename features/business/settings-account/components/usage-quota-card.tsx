import { Card } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'
import type { UsageQuota } from './billing-subscription-form'
import { Progress } from '@/components/ui/progress'

export function UsageQuotaCard({ quotas }: { quotas: UsageQuota[] }) {
  return (
    <Card className="p-6">
      <div className="flex flex-col gap-8">
        <div>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Usage & Quotas</h3>
          <p className="text-sm text-muted-foreground">Current usage against your plan limits</p>
        </div>

        <div className="flex flex-col gap-6">
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
                    <p className="text-sm text-muted-foreground text-xs text-destructive">
                      Approaching limit - consider upgrading
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}
