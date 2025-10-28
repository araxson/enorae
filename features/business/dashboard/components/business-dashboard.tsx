import { Suspense } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ShieldAlert, Store } from 'lucide-react'
import { getUserRole } from '@/lib/auth'
import {
  getDashboardMetrics,
  getRecentAppointments,
  getUserSalon,
  getMultiLocationMetrics,
} from '@/features/business/dashboard/api/queries'
import { getReviewStats } from '@/features/business/reviews/api/queries'
import type { AppointmentWithDetails } from '@/features/business/dashboard/api/queries'
import type {
  BusinessDashboardMetrics,
  BusinessMultiLocationMetrics,
  BusinessReviewStats,
} from '@/features/business/dashboard/types'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Spinner } from '@/components/ui/spinner'

import { AnalyticsTab } from './analytics-tab'
import { DashboardView } from './dashboard-view'

const EMPTY_METRICS: BusinessDashboardMetrics = {
  totalAppointments: 0,
  confirmedAppointments: 0,
  pendingAppointments: 0,
  totalStaff: 0,
  totalServices: 0,
  totalRevenue: 0,
  last30DaysRevenue: 0,
}

const EMPTY_REVIEWS: BusinessReviewStats = {
  totalReviews: 0,
  averageRating: 0,
  ratingDistribution: [],
  pendingResponses: 0,
  flaggedCount: 0,
}

export async function BusinessDashboardPage() {
  let salon
  try {
    salon = await getUserSalon()
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    if (message.includes('Authentication required')) {
      redirect('/login?redirect=/business')
    }
    if (message.includes('role required')) {
      return (
        <section className="py-16 md:py-24 lg:py-32">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <ShieldAlert className="h-8 w-8" aria-hidden="true" />
                </EmptyMedia>
                <EmptyTitle>Access denied</EmptyTitle>
                <EmptyDescription>
                  You don&apos;t have permission to access the business dashboard. Please contact your administrator.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button asChild variant="outline">
                  <Link href="/">Go home</Link>
                </Button>
              </EmptyContent>
            </Empty>
          </div>
        </section>
      )
    }
    throw error
  }

  if (!salon || !salon.id) {
    return (
      <section className="py-16 md:py-24 lg:py-32">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Store className="h-8 w-8" aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>No Salon Found</EmptyTitle>
              <EmptyDescription>
                You need to create or be assigned to a salon to access the dashboard.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button variant="default" asChild>
                <Link href="/business/settings/salon">Create Salon</Link>
              </Button>
            </EmptyContent>
          </Empty>
        </div>
      </section>
    )
  }

  const userRole = await getUserRole()
  const isTenantOwner = userRole === 'tenant_owner'

  const [metrics, reviewStats, recentAppointments, multiLocationMetrics] = await Promise.all([
    getMetricsSafe(salon.id),
    getReviewStatsSafe(salon.id),
    getRecentAppointmentsSafe(salon.id),
    isTenantOwner ? getMultiLocationMetricsSafe() : Promise.resolve<BusinessMultiLocationMetrics | null>(null),
  ])

  return (
    <DashboardView
      salon={salon}
      metrics={metrics}
      reviewStats={reviewStats}
      recentAppointments={recentAppointments}
      multiLocationMetrics={multiLocationMetrics}
      isTenantOwner={isTenantOwner}
      analyticsPanel={
        <Suspense
          fallback={
            <Empty className="py-12">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Spinner className="size-8" />
                </EmptyMedia>
                <EmptyTitle>Loading analytics</EmptyTitle>
                <EmptyDescription>Fetching the latest performance insights…</EmptyDescription>
              </EmptyHeader>
            </Empty>
          }
        >
          <AnalyticsTab salonId={salon.id} />
        </Suspense>
      }
    />
  )
}

async function getMetricsSafe(salonId: string): Promise<BusinessDashboardMetrics> {
  try {
    return await getDashboardMetrics(salonId)
  } catch (error) {
    console.error('[BusinessDashboard] Error loading metrics:', error)
    return EMPTY_METRICS
  }
}

async function getReviewStatsSafe(salonId: string): Promise<BusinessReviewStats> {
  try {
    return await getReviewStats(salonId)
  } catch (error) {
    console.error('[BusinessDashboard] Error loading review stats:', error)
    return EMPTY_REVIEWS
  }
}

async function getRecentAppointmentsSafe(salonId: string): Promise<AppointmentWithDetails[]> {
  try {
    return await getRecentAppointments(salonId)
  } catch (error) {
    console.error('[BusinessDashboard] Error loading appointments:', error)
    return []
  }
}

async function getMultiLocationMetricsSafe(): Promise<BusinessMultiLocationMetrics | null> {
  try {
    return await getMultiLocationMetrics()
  } catch (error) {
    console.error('[BusinessDashboard] Error loading multi-location metrics:', error)
    return null
  }
}
