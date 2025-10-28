'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { TrendingUp, TrendingDown, BarChart3, Star } from 'lucide-react'
import type { ServicePerformance } from '@/features/business/service-performance-analytics/api/queries'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
} from '@/components/ui/item'

type ServiceProfitability = {
  service_id: string
  service_name: string
  revenue: number
  cost: number
  profit: number
  margin: number
}

type StaffLeader = {
  service_id: string
  service_name: string
  staff: Array<{ staff_id: string; staff_name: string; appointmentCount: number; revenue: number }>
}

type ServicePairing = {
  primary: string
  paired: string
  count: number
}

type DurationAccuracy = {
  service_id: string
  service_name: string
  expected_duration: number | null
  actual_duration: number | null
  variance: number | null
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}

export function ProfitabilitySection({ profitability }: { profitability: ServiceProfitability[] }) {
  const mostProfitable = [...profitability]
    .sort((a, b) => b.profit - a.profit)
    .slice(0, 5)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profitability by Service</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <ItemGroup className="flex flex-col gap-2">
          {mostProfitable.map((entry) => (
            <Item key={entry.service_id} variant="outline" className="items-start">
              <ItemContent>
                <h4 className="scroll-m-20 text-base font-semibold tracking-tight">{entry.service_name}</h4>
                <ItemDescription>
                  Margin {Number.isFinite(entry.margin) ? entry.margin.toFixed(1) : '0'}%
                </ItemDescription>
              </ItemContent>
              <ItemActions className="flex-col items-end text-right">
                <span>{formatCurrency(entry.profit)}</span>
                <span className="text-muted-foreground">
                  Revenue {formatCurrency(entry.revenue)} · Cost {formatCurrency(entry.cost)}
                </span>
              </ItemActions>
            </Item>
          ))}
        </ItemGroup>
      </CardContent>
    </Card>
  )
}

export function ServiceOverviewSection({ services }: { services: ServicePerformance[] }) {
  const getPerformanceIcon = (cancellationRate: number) => {
    if (cancellationRate < 10) return <TrendingUp className="h-4 w-4 text-primary" />
    if (cancellationRate > 20) return <TrendingDown className="h-4 w-4 text-destructive" />
    return <BarChart3 className="h-4 w-4 text-accent" />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Performance Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {services.map((service) => (
            <Card key={service.service_id}>
              <CardContent className="space-y-4">
                <ItemGroup>
                  <Item>
                    <ItemContent>
                      <h4 className="scroll-m-20 text-lg font-semibold tracking-tight">{service.service_name}</h4>
                      <div className="mt-1 flex items-center gap-2">
                        {getPerformanceIcon(service.cancellation_rate || 0)}
                        <span className="text-muted-foreground">
                          {service.cancellation_rate?.toFixed(1) || 0}% cancellation rate
                        </span>
                      </div>
                    </ItemContent>
                    <ItemActions className="flex-none">
                      <Badge variant={service.cancellation_rate > 20 ? 'destructive' : 'default'}>
                        {service.cancellation_rate > 20 ? 'Needs Attention' : 'Performing Well'}
                      </Badge>
                    </ItemActions>
                  </Item>
                </ItemGroup>

                <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                  <div>
                    <p className="text-muted-foreground">Total Bookings</p>
                    <p>{service.total_bookings}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Revenue</p>
                    <p>{formatCurrency(service.total_revenue)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Avg Rating</p>
                    <div className="flex items-center gap-1">
                      <p>{service.avg_rating?.toFixed(1) || 'N/A'}</p>
                      <Star className="h-4 w-4 text-accent" />
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Popularity Score</p>
                    <p>{service.popularity_score?.toFixed(0) || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function StaffPerformanceSection({ staffPerformance }: { staffPerformance: StaffLeader[] }) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {staffPerformance.map((record) => (
        <AccordionItem key={record.service_id} value={record.service_id}>
          <AccordionTrigger>{record.service_name}</AccordionTrigger>
          <AccordionContent className="space-y-1 text-muted-foreground">
            <ItemGroup>
              {record.staff.slice(0, 3).map((staff) => (
                <Item key={staff.staff_id}>
                  <ItemContent>
                    <ItemDescription>{staff.staff_name}</ItemDescription>
                  </ItemContent>
                  <ItemActions className="flex-none">
                    <ItemDescription>
                      {staff.appointmentCount} appts · {formatCurrency(staff.revenue)}
                    </ItemDescription>
                  </ItemActions>
                </Item>
              ))}
            </ItemGroup>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

export function ServicePairingsSection({ pairings }: { pairings: ServicePairing[] }) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {pairings.map((pair) => (
        <AccordionItem key={`${pair.primary}-${pair.paired}`} value={`${pair.primary}-${pair.paired}`}>
          <AccordionTrigger>{pair.primary}</AccordionTrigger>
          <AccordionContent>
            <ItemGroup>
              <Item>
                <ItemContent>
                  <ItemDescription>Often paired with {pair.paired}</ItemDescription>
                </ItemContent>
                <ItemActions className="flex-none">
                  <Badge variant="secondary">{pair.count} combos</Badge>
                </ItemActions>
              </Item>
            </ItemGroup>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

export function DurationAccuracySection({ durationAccuracy }: { durationAccuracy: DurationAccuracy[] }) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {durationAccuracy.map((entry) => (
        <AccordionItem key={entry.service_id} value={entry.service_id}>
          <AccordionTrigger className="flex items-center justify-between">
            <span>{entry.service_name}</span>
            {entry.variance != null && (
              <Badge variant={Math.abs(entry.variance) > 10 ? 'destructive' : 'outline'} className="ml-2">
                {entry.variance > 0 ? '+' : ''}{entry.variance} min
              </Badge>
            )}
          </AccordionTrigger>
          <AccordionContent className="space-y-2 text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>Scheduled</span>
              <span>{entry.expected_duration ? `${entry.expected_duration} min` : 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Actual</span>
              <span>{entry.actual_duration ? `${entry.actual_duration} min` : 'N/A'}</span>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
