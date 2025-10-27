'use client'

import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Field, FieldContent, FieldLabel, FieldSet } from '@/components/ui/field'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'

type SegmentationData = {
  counts: { active: number; atRisk: number; churned: number }
  averageLTV: number
  medianLTV: number
  vip: Array<{ name: string; email?: string; totalSpent: number; visits: number }>
  frequencyBuckets: { one: number; twoToThree: number; fourToNine: number; tenPlus: number }
  aovBuckets: { under50: number; between50And100: number; between100And200: number; over200: number }
}

type SegmentationOverviewProps = {
  data: SegmentationData
}

const bucketLabels = [
  { key: 'one', label: 'One Visit' },
  { key: 'twoToThree', label: '2-3 Visits' },
  { key: 'fourToNine', label: '4-9 Visits' },
  { key: 'tenPlus', label: '10+ Visits' },
] as const

const aovLabels = [
  { key: 'under50', label: '< $50' },
  { key: 'between50And100', label: '$50 - $100' },
  { key: 'between100And200', label: '$100 - $200' },
  { key: 'over200', label: '$200 +' },
] as const

export function SegmentationOverview({ data }: SegmentationOverviewProps) {
  const totalCustomers = data.counts.active + data.counts.atRisk + data.counts.churned

  const renderProgressRow = (
    label: string,
    value: number,
    total: number,
    tone: 'default' | 'secondary' | 'destructive' = 'default'
  ) => {
    const percentage = total === 0 ? 0 : (value / total) * 100
    const progressClass =
      tone === 'destructive'
        ? 'h-2 [&>div]:bg-destructive'
        : tone === 'secondary'
          ? 'h-2 [&>div]:bg-accent'
          : 'h-2'
    return (
      <Field>
        <FieldLabel>{label}</FieldLabel>
        <FieldContent className="gap-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{value}</span>
            <span>{percentage.toFixed(0)}%</span>
          </div>
          <Progress value={percentage} className={progressClass} />
        </FieldContent>
      </Field>
    )
  }

  return (
    <div className="grid gap-4 grid-cols-1 xl:grid-cols-3">
      <Item variant="outline" className="xl:col-span-2 flex-col gap-4">
        <ItemHeader>
          <ItemTitle>Customer Segments</ItemTitle>
          <ItemDescription>Distribution of customers by engagement health</ItemDescription>
        </ItemHeader>
        <ItemContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Badge variant="default">Active · {data.counts.active}</Badge>
            <Badge variant="secondary">At Risk · {data.counts.atRisk}</Badge>
            <Badge variant="destructive">Churned · {data.counts.churned}</Badge>
          </div>
          <FieldSet className="space-y-3">
            {renderProgressRow('Active', data.counts.active, totalCustomers)}
            {renderProgressRow('At Risk', data.counts.atRisk, totalCustomers, 'secondary')}
            {renderProgressRow('Churned', data.counts.churned, totalCustomers, 'destructive')}
          </FieldSet>
        </ItemContent>
      </Item>

      <Item variant="outline" className="flex-col gap-4">
        <ItemHeader>
          <ItemTitle>Lifetime Value</ItemTitle>
          <ItemDescription>Average customer revenue contribution</ItemDescription>
        </ItemHeader>
        <ItemContent className="space-y-4">
          <FieldSet className="space-y-3">
            <Field>
              <FieldLabel>Average LTV</FieldLabel>
              <FieldContent>
                <div className="text-2xl font-semibold">${data.averageLTV.toFixed(2)}</div>
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>Median LTV</FieldLabel>
              <FieldContent>
                <div className="text-xl font-semibold">${data.medianLTV.toFixed(2)}</div>
              </FieldContent>
            </Field>
          </FieldSet>
          <div>
            <FieldLabel>Top VIP Customers</FieldLabel>
            {data.vip.length === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyTitle>No VIP customers identified</EmptyTitle>
                  <EmptyDescription>Encourage repeat visits to build loyalty tiers.</EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <ItemGroup className="mt-2 space-y-2">
                {data.vip.slice(0, 3).map((customer) => (
                  <Item key={customer.name}>
                    <ItemContent>
                      <ItemTitle>{customer.name}</ItemTitle>
                      {customer.email ? (
                        <ItemDescription>{customer.email}</ItemDescription>
                      ) : null}
                    </ItemContent>
                    <ItemActions className="flex-none">
                      <ItemDescription>${customer.totalSpent.toFixed(0)}</ItemDescription>
                    </ItemActions>
                  </Item>
                ))}
              </ItemGroup>
            )}
          </div>
        </ItemContent>
      </Item>

      <Item variant="outline" className="xl:col-span-2 flex-col gap-4">
        <ItemHeader>
          <ItemTitle>Visit Frequency</ItemTitle>
          <ItemDescription>How often customers return for services</ItemDescription>
        </ItemHeader>
        <ItemContent>
          <FieldSet className="space-y-3">
            {bucketLabels.map((bucket) =>
              renderProgressRow(
                bucket.label,
                data.frequencyBuckets[bucket.key],
                Object.values(data.frequencyBuckets).reduce((sum, val) => sum + val, 0)
              )
            )}
          </FieldSet>
        </ItemContent>
      </Item>

      <Item variant="outline" className="flex-col gap-4">
        <ItemHeader>
          <ItemTitle>Average Order Value</ItemTitle>
          <ItemDescription>Distribution of spend per visit</ItemDescription>
        </ItemHeader>
        <ItemContent>
          <FieldSet className="space-y-3">
            {aovLabels.map((bucket) =>
              renderProgressRow(
                bucket.label,
                data.aovBuckets[bucket.key],
                Object.values(data.aovBuckets).reduce((sum, val) => sum + val, 0)
              )
            )}
          </FieldSet>
        </ItemContent>
      </Item>
    </div>
  )
}
