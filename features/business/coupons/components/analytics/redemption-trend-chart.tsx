'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { format } from 'date-fns'
import { buildCouponEffectiveness } from '@/features/business/coupons/api/queries/coupon-validation'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'

type RedemptionTrendChartProps = {
  trend: ReturnType<typeof buildCouponEffectiveness>['trend']
}

export function RedemptionTrendChart({ trend }: RedemptionTrendChartProps) {
  return (
    <Card>
      <CardHeader>
        <ItemGroup>
          <Item className="flex-col items-start gap-1">
            <ItemContent>
              <ItemTitle>Redemption Trend</ItemTitle>
            </ItemContent>
            <ItemContent>
              <ItemDescription>Daily coupon usage and discount impact</ItemDescription>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            uses: { label: 'Uses', color: 'hsl(var(--chart-1))' },
            discount: { label: 'Discount', color: 'hsl(var(--chart-2))' },
          }}
          className="h-64 w-full"
        >
          <ResponsiveContainer>
            <AreaChart
              data={trend.map((point) => ({
                ...point,
                label: format(new Date(point.date), 'MMM dd'),
              }))}
              margin={{ top: 10, right: 12, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                className="text-xs"
              />
              <YAxis
                yAxisId="left"
                tickLine={false}
                axisLine={false}
                className="text-xs"
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tickLine={false}
                axisLine={false}
                className="text-xs"
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="uses"
                yAxisId="left"
                stroke="var(--color-uses)"
                fill="var(--color-uses)"
                fillOpacity={0.2}
              />
              <Area
                type="monotone"
                dataKey="discount"
                yAxisId="right"
                stroke="var(--color-discount)"
                fill="var(--color-discount)"
                fillOpacity={0.15}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
