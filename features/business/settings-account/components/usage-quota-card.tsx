import { Item, ItemContent, ItemDescription, ItemHeader, ItemTitle } from '@/components/ui/item'
import { AlertCircle } from 'lucide-react'
import type { UsageQuota } from '../types'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Field, FieldContent, FieldLabel } from '@/components/ui/field'

export function UsageQuotaCard({ quotas }: { quotas: UsageQuota[] }) {
  return (
    <Item variant="outline" className="flex-col gap-4">
      <ItemHeader>
        <ItemTitle>Usage & Quotas</ItemTitle>
        <ItemDescription>Current usage against your plan limits</ItemDescription>
      </ItemHeader>
      <ItemContent className="flex flex-col gap-6">
        {quotas.map((quota) => {
          const percentage = (quota.used / quota.limit) * 100
          const isNearLimit = percentage >= 80

          return (
            <Field key={quota.name} className="gap-2">
              <FieldContent className="flex items-center justify-between gap-2">
                <FieldLabel>{quota.name}</FieldLabel>
                <span className="text-sm text-muted-foreground">
                  {quota.used} / {quota.limit} {quota.unit}
                </span>
              </FieldContent>
              <FieldContent className="gap-2">
                <Progress
                  value={Math.min(percentage, 100)}
                  className={`h-2 ${isNearLimit ? 'bg-destructive/10' : ''}`}
                />
                {isNearLimit && (
                  <Alert variant="destructive">
                    <AlertCircle className="size-4" aria-hidden="true" />
                    <AlertTitle>Approaching limit</AlertTitle>
                    <AlertDescription>
                      Consider upgrading to avoid hitting this quota.
                    </AlertDescription>
                  </Alert>
                )}
              </FieldContent>
            </Field>
          )
        })}
      </ItemContent>
    </Item>
  )
}
