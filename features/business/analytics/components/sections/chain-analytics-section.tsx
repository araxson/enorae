'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ExportButton } from '@/features/business/business-common/components'
import { Building2, TrendingUp } from 'lucide-react'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'

type ChainBreakdown = {
  salonId: string
  salonName: string
  revenue: number
  appointments: number
}

type ChainComparison = {
  totalRevenue: number
  previousRevenue: number
  momGrowth: number
  yoyRevenue: number
  yoyGrowth: number
}

type Props = {
  start: string
  end: string
  breakdown: ChainBreakdown[]
  comparison: ChainComparison
}

export function ChainAnalyticsSection({ start, end, breakdown, comparison }: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex gap-4 items-center items-center justify-between">
          <div className="flex gap-2 items-center items-center">
            <Building2 className="h-4 w-4" aria-hidden />
            <CardTitle>Chain analytics</CardTitle>
          </div>
          <ExportButton
            data={breakdown.map((row) => ({
              salon_id: row.salonId,
              salon_name: row.salonName,
              revenue: row.revenue,
              appointments: row.appointments,
            }))}
            filename={`chain-analytics-${start}-to-${end}`}
          />
        </div>
        <CardDescription>Performance across all salons in your chain.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-5">
          <Stat label="Total Revenue" value={`$${comparison.totalRevenue.toLocaleString()}`} />
          <Stat label="Prev Period" value={`$${comparison.previousRevenue.toLocaleString()}`} />
          <Stat
            label="MoM Growth"
            value={
              <span className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                {comparison.momGrowth.toFixed(1)}%
              </span>
            }
          />
          <Stat label="YoY Revenue" value={`$${comparison.yoyRevenue.toLocaleString()}`} />
          <Stat
            label="YoY Growth"
            value={
              <span className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                {comparison.yoyGrowth.toFixed(1)}%
              </span>
            }
          />
        </div>

        <div className="mt-4 space-y-2">
          <CardDescription>Top Salons by Revenue</CardDescription>
          <ItemGroup className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
            {breakdown.slice(0, 6).map((row) => (
              <Item key={row.salonId} variant="outline" className="flex-col gap-1">
                <ItemContent>
                  <ItemTitle>{row.salonName}</ItemTitle>
                  <ItemDescription>
                    ${row.revenue.toLocaleString()} • {row.appointments} appts
                  </ItemDescription>
                </ItemContent>
              </Item>
            ))}
          </ItemGroup>
        </div>
      </CardContent>
    </Card>
  )
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <CardDescription>{label}</CardDescription>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  )
}
