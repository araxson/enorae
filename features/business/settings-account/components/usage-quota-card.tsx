import { Card } from '@/components/ui/card'
import { Stack, Flex } from '@/components/layout'
import { H3, Muted } from '@/components/ui/typography'
import { AlertCircle } from 'lucide-react'
import type { UsageQuota } from './billing-subscription-form'

export function UsageQuotaCard({ quotas }: { quotas: UsageQuota[] }) {
  return (
    <Card className="p-6">
      <Stack gap="lg">
        <div>
          <H3>Usage & Quotas</H3>
          <Muted>Current usage against your plan limits</Muted>
        </div>

        <Stack gap="md">
          {quotas.map((quota) => {
            const percentage = (quota.used / quota.limit) * 100
            const isNearLimit = percentage >= 80

            return (
              <div key={quota.name}>
                <Flex justify="between" className="mb-2">
                  <span className="text-sm font-medium">{quota.name}</span>
                  <span className="text-sm">
                    {quota.used} / {quota.limit} {quota.unit}
                  </span>
                </Flex>
                <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      isNearLimit ? 'bg-red-500' : 'bg-primary'
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
                {isNearLimit && (
                  <Flex gap="sm" align="center" className="mt-1">
                    <AlertCircle className="h-3 w-3 text-red-500" />
                    <Muted className="text-xs text-red-600">
                      Approaching limit - consider upgrading
                    </Muted>
                  </Flex>
                )}
              </div>
            )
          })}
        </Stack>
      </Stack>
    </Card>
  )
}
