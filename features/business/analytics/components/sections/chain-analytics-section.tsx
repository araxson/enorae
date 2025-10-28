'use client'

import { ExportButton } from '@/features/business/business-common/components'
import { Building2, TrendingUp } from 'lucide-react'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
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
    <Item variant="outline" className="flex-col gap-6">
      <ItemHeader>
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex items-center gap-2">
            <Building2 className="size-4" aria-hidden />
            <ItemTitle>Chain analytics</ItemTitle>
          </div>
          <ItemDescription>Performance across all salons in your chain.</ItemDescription>
        </div>
        <ItemActions>
          <ExportButton
            data={breakdown.map((row) => ({
              salon_id: row.salonId,
              salon_name: row.salonName,
              revenue: row.revenue,
              appointments: row.appointments,
            }))}
            filename={`chain-analytics-${start}-to-${end}`}
          />
        </ItemActions>
      </ItemHeader>
      <ItemContent className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
          <Stat label="Total Revenue" value={`$${comparison.totalRevenue.toLocaleString()}`} />
          <Stat label="Prev Period" value={`$${comparison.previousRevenue.toLocaleString()}`} />
          <Stat
            label="MoM Growth"
            value={
              <span className="flex items-center gap-1">
                <TrendingUp className="size-4" />
                {comparison.momGrowth.toFixed(1)}%
              </span>
            }
          />
          <Stat label="YoY Revenue" value={`$${comparison.yoyRevenue.toLocaleString()}`} />
          <Stat
            label="YoY Growth"
            value={
              <span className="flex items-center gap-1">
                <TrendingUp className="size-4" />
                {comparison.yoyGrowth.toFixed(1)}%
              </span>
            }
          />
        </div>

        <div className="space-y-2">
          <ItemDescription>Top Salons by Revenue</ItemDescription>
          <ItemGroup className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
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
      </ItemContent>
    </Item>
  )
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  const statValueClass = 'text-2xl font-semibold leading-none tracking-tight'

  return (
    <div>
      <ItemDescription>{label}</ItemDescription>
      <p className={statValueClass}>{value}</p>
    </div>
  )
}
