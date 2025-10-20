import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { RevenueOverview } from './admin-overview-types'
import { formatCurrency, safeFormatDate } from './admin-overview-utils'

type RevenueTabProps = {
  revenue: RevenueOverview[]
  windowSize: number
}

export function AdminOverviewRevenueTab({ revenue, windowSize }: RevenueTabProps) {
  if (revenue.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Revenue trends</CardTitle>
          <CardDescription>
            Platform-wide revenue analytics across the most recent periods.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No revenue data is available yet. Once salons start transacting, trends will appear here.
          </p>
        </CardContent>
      </Card>
    )
  }

  const rows = revenue.slice(0, 20)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue trends</CardTitle>
        <CardDescription>
          Platform-wide revenue analytics across the most recent periods.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="gap-1 text-xs">
            {windowSize || '0'} day window
          </Badge>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-xs text-muted-foreground">
                Track revenue momentum and appointment conversion.
              </span>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs text-xs text-muted-foreground">
              Compare revenue and appointment totals to quickly detect drops in conversion or spikes in demand.
            </TooltipContent>
          </Tooltip>
        </div>

        <ScrollArea className="h-80 pr-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Period</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Appointments</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((item, index) => (
                <TableRow key={`${item.date}-${item.total_revenue}-${index}`}>
                  <TableCell className="font-medium">
                    {safeFormatDate(item.date, 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(item.total_revenue)}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {(item.total_appointments ?? 0).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
