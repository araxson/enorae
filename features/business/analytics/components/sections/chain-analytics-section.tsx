'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ExportButton } from '@/features/business/business-common/components'
import { Building2, TrendingUp } from 'lucide-react'

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

        <div className="mt-4">
          <p className="text-sm font-medium text-muted-foreground">Top Salons by Revenue</p>
          <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
            {breakdown.slice(0, 6).map((row) => (
              <Card key={row.salonId}>
                <CardContent className="p-4">
                  <div className="font-medium">{row.salonName}</div>
                  <div className="text-sm text-muted-foreground">
                    ${row.revenue.toLocaleString()} • {row.appointments} appts
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  )
}
