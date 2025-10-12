'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Grid } from '@/components/layout'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

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
    return (
      <div className="space-y-1">
        <div className="flex items-center justify-between text-sm">
          <span>{label}</span>
          <span className="text-muted-foreground">{value}</span>
        </div>
        <Progress value={percentage} className={tone === 'destructive' ? 'h-2 bg-rose-100' : 'h-2'} />
      </div>
    )
  }

  return (
    <Grid cols={{ base: 1, xl: 3 }} gap="md">
      <Card className="xl:col-span-2">
        <CardHeader>
          <CardTitle>Customer Segments</CardTitle>
          <CardDescription>Distribution of customers by engagement health</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Badge variant="default">Active · {data.counts.active}</Badge>
            <Badge variant="secondary">At Risk · {data.counts.atRisk}</Badge>
            <Badge variant="destructive">Churned · {data.counts.churned}</Badge>
          </div>
          <div className="space-y-3">
            {renderProgressRow('Active', data.counts.active, totalCustomers)}
            {renderProgressRow('At Risk', data.counts.atRisk, totalCustomers, 'secondary')}
            {renderProgressRow('Churned', data.counts.churned, totalCustomers, 'destructive')}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lifetime Value</CardTitle>
          <CardDescription>Average customer revenue contribution</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Average LTV</p>
            <p className="text-2xl font-semibold">${data.averageLTV.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Median LTV</p>
            <p className="text-xl font-semibold">${data.medianLTV.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Top VIP Customers</p>
            <div className="space-y-2 text-sm">
              {data.vip.slice(0, 3).map((customer) => (
                <div key={customer.name} className="flex justify-between">
                  <span>{customer.name}</span>
                  <span className="text-muted-foreground">${customer.totalSpent.toFixed(0)}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="xl:col-span-2">
        <CardHeader>
          <CardTitle>Visit Frequency</CardTitle>
          <CardDescription>How often customers return for services</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {bucketLabels.map((bucket) =>
            renderProgressRow(
              bucket.label,
              data.frequencyBuckets[bucket.key],
              Object.values(data.frequencyBuckets).reduce((sum, val) => sum + val, 0)
            )
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Average Order Value</CardTitle>
          <CardDescription>Distribution of spend per visit</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {aovLabels.map((bucket) =>
            renderProgressRow(
              bucket.label,
              data.aovBuckets[bucket.key],
              Object.values(data.aovBuckets).reduce((sum, val) => sum + val, 0)
            )
          )}
        </CardContent>
      </Card>
    </Grid>
  )
}
