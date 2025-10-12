'use client'

import { Box, Grid, Group } from '@/components/layout'
import { Small } from '@/components/ui/typography'
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
    <Box className="rounded-lg border p-4">
      <Group className="items-center justify-between mb-3">
        <Group gap="xs" className="items-center">
          <Building2 className="h-4 w-4" aria-hidden />
          <Small className="font-semibold">Chain Analytics (All Salons)</Small>
        </Group>
        <ExportButton
          data={breakdown.map((row) => ({
            salon_id: row.salonId,
            salon_name: row.salonName,
            revenue: row.revenue,
            appointments: row.appointments,
          }))}
          filename={`chain-analytics-${start}-to-${end}`}
        />
      </Group>

      <Grid cols={{ base: 1, md: 3, lg: 5 }} gap="md">
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
      </Grid>

      <div className="mt-4">
        <Small className="text-muted-foreground">Top Salons by Revenue</Small>
        <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
          {breakdown.slice(0, 6).map((row) => (
            <Box key={row.salonId} className="rounded border p-3">
              <div className="font-medium">{row.salonName}</div>
              <div className="text-sm text-muted-foreground">
                ${row.revenue.toLocaleString()} • {row.appointments} appts
              </div>
            </Box>
          ))}
        </div>
      </div>
    </Box>
  )
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Box>
      <Small className="text-muted-foreground">{label}</Small>
      <div className="text-2xl font-bold">{value}</div>
    </Box>
  )
}
