'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Users, Link2 } from 'lucide-react'
import type { ServicePerformance } from '@/features/business/service-performance-analytics/api/queries'
import { RevenueLeaders } from './partials/revenue-leaders'
import { PopularityRanking } from './partials/popularity-ranking'
import { formatCurrency } from './partials/format-utils'
import {
  ProfitabilitySection,
  ServiceOverviewSection,
  StaffPerformanceSection,
  ServicePairingsSection,
  DurationAccuracySection,
} from './partials/service-performance-sections'

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

type Props = {
  services: ServicePerformance[]
  profitability: ServiceProfitability[]
  staffPerformance: StaffLeader[]
  pairings: ServicePairing[]
  durationAccuracy: DurationAccuracy[]
}

export function ServicePerformanceDashboard({
  services,
  profitability,
  staffPerformance,
  pairings,
  durationAccuracy,
}: Props) {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        <RevenueLeaders services={services} formatCurrency={formatCurrency} />
        <PopularityRanking services={services} formatCurrency={formatCurrency} />
      </div>

      <ProfitabilitySection profitability={profitability} />
      <ServiceOverviewSection services={services} />

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Staff Leaders by Service</CardTitle>
            <CardDescription>Identify the top performers driving revenue.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="size-5" aria-hidden="true" />
              <span className="text-sm font-medium">Staff performance overview</span>
            </div>
            <StaffPerformanceSection staffPerformance={staffPerformance} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Service Pairings</CardTitle>
            <CardDescription>Understand complementary services booked together.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Link2 className="size-5" aria-hidden="true" />
              <span className="text-sm font-medium">Common combinations</span>
            </div>
            <ServicePairingsSection pairings={pairings} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Duration Accuracy</CardTitle>
        </CardHeader>
        <CardContent>
          <DurationAccuracySection durationAccuracy={durationAccuracy} />
        </CardContent>
      </Card>
    </div>
  )
}
