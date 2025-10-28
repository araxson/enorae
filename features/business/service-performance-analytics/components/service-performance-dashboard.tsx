'use client'

import { Card, CardHeader, CardTitle } from '@/components/ui/card'
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
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <CardTitle>Staff Leaders by Service</CardTitle>
            </div>
          </CardHeader>
          <StaffPerformanceSection staffPerformance={staffPerformance} />
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Link2 className="h-5 w-5" />
              <CardTitle>Service Pairings</CardTitle>
            </div>
          </CardHeader>
          <ServicePairingsSection pairings={pairings} />
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Duration Accuracy</CardTitle>
        </CardHeader>
        <DurationAccuracySection durationAccuracy={durationAccuracy} />
      </Card>
    </div>
  )
}
