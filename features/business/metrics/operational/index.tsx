import { subDays, format } from 'date-fns'
import { Section, Stack, Box } from '@/components/layout'
import { H1, Lead } from '@/components/ui/typography'
import { getUserSalon } from '@/features/business/dashboard/api/queries'
import {
  getOperationalMetrics,
  getLatestOperationalMetric,
  getServiceDistribution,
  getPeakHours,
  getStaffPerformance,
} from './api/queries'
import { OperationalDashboard } from './components/operational-dashboard'
import { AdvancedMetricsDashboard } from './components/advanced-metrics-dashboard'

type Props = {
  dateFrom?: string
  dateTo?: string
}

export async function OperationalMetrics({ dateFrom, dateTo }: Props = {}) {
  // Default to last 30 days
  const today = new Date()
  const thirtyDaysAgo = subDays(today, 30)
  const currentDateFrom = dateFrom || format(thirtyDaysAgo, 'yyyy-MM-dd')
  const currentDateTo = dateTo || format(today, 'yyyy-MM-dd')

  const salon = await getUserSalon()

  if (!salon) {
    return (
      <Section size="lg">
        <Stack gap="xl">
          <Box>
            <H1>Operational Metrics</H1>
            <Lead>Please create a salon to view operational metrics</Lead>
          </Box>
        </Stack>
      </Section>
    )
  }

  const [, latestMetric, serviceDistribution, peakHours, staffPerformance] =
    await Promise.all([
      getOperationalMetrics(salon.id!, currentDateFrom, currentDateTo),
      getLatestOperationalMetric(salon.id!),
      getServiceDistribution(salon.id!, currentDateFrom, currentDateTo),
      getPeakHours(salon.id!, currentDateFrom, currentDateTo),
      getStaffPerformance(salon.id!, currentDateFrom, currentDateTo),
    ])

  // Compute metrics from staff performance and other data
  const totalAppointments = staffPerformance.reduce((sum, s) => sum + s.totalAppointments, 0)
  const completedAppointments = staffPerformance.reduce((sum, s) => sum + s.completedAppointments, 0)
  const cancelledAppointments = staffPerformance.reduce((sum, s) => sum + s.cancelledAppointments, 0)
  const noShowAppointments = totalAppointments - completedAppointments - cancelledAppointments

  const avgUtilization = staffPerformance.length > 0
    ? staffPerformance.reduce((sum, s) => sum + s.utilizationRate, 0) / staffPerformance.length
    : 0

  const computedMetrics = {
    staffUtilizationRate: avgUtilization,
    activeStaff: staffPerformance.filter(s => s.totalAppointments > 0).length,
    totalStaff: staffPerformance.length,
    completionRate: totalAppointments > 0 ? (completedAppointments / totalAppointments) * 100 : 0,
    completedAppointments,
    totalAppointments,
    capacityUtilization: avgUtilization, // Use same as staff utilization for now
    bookedHours: serviceDistribution.reduce((sum, s) => sum + (s.serviceCount * s.avgDuration / 60), 0),
    totalCapacityHours: staffPerformance.length * 8 * 30, // Assume 8 hours/day, 30 days
    noShowRate: totalAppointments > 0 ? (noShowAppointments / totalAppointments) * 100 : 0,
    noShowAppointments: Math.max(0, noShowAppointments),
    cancelledAppointments,
  }

  return (
    <Section size="lg">
      <Stack gap="xl">
        <Box>
          <H1>Operational Metrics</H1>
          <Lead>Monitor staff performance, capacity utilization, and service efficiency</Lead>
        </Box>

        <OperationalDashboard
          metrics={computedMetrics}
          serviceDistribution={serviceDistribution}
          peakHours={peakHours}
          staffPerformance={staffPerformance}
        />

        {latestMetric && <AdvancedMetricsDashboard metric={latestMetric} />}
      </Stack>
    </Section>
  )
}
