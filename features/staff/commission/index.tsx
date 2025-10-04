import { DollarSign, TrendingUp, Calendar, PieChart } from 'lucide-react'
import { Section, Stack } from '@/components/layout'
import { H1, Lead, P, Muted } from '@/components/ui/typography'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getStaffProfile } from '../appointments/api/queries'
import { getStaffCommission } from './api/queries'
import { getDailyEarnings, getServiceBreakdown } from './api/enhanced-queries'
import { EarningsChart } from './components/earnings-chart'
import { ServiceBreakdown } from './components/service-breakdown'

export async function StaffCommission() {
  let staffProfile
  try {
    staffProfile = await getStaffProfile()
  } catch (error) {
    return (
      <Section size="lg">
        <Alert>
          <AlertDescription>
            {error instanceof Error ? error.message : 'Please log in to view commission data'}
          </AlertDescription>
        </Alert>
      </Section>
    )
  }

  if (!staffProfile) {
    return (
      <Section size="lg">
        <Alert>
          <AlertDescription>Staff profile not found</AlertDescription>
        </Alert>
      </Section>
    )
  }

  const staff = staffProfile as { id: string }

  const today = new Date()
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString()
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString()

  const [commission, dailyEarnings, serviceBreakdown] = await Promise.all([
    getStaffCommission(staff.id),
    getDailyEarnings(staff.id, 30),
    getServiceBreakdown(staff.id, startOfMonth, endOfMonth),
  ])

  return (
    <Section size="lg">
      <Stack gap="xl">
        <div>
          <H1>Commission</H1>
          <Lead>Track your earnings and performance</Lead>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Today&apos;s Earnings</CardTitle>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${commission.todayEarnings.toFixed(2)}</div>
              <Muted className="text-xs">Revenue from completed appointments</Muted>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <Calendar className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${commission.weekEarnings.toFixed(2)}</div>
              <Muted className="text-xs">Week-to-date earnings</Muted>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${commission.monthEarnings.toFixed(2)}</div>
              <Muted className="text-xs">Monthly revenue total</Muted>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avg Per Appointment</CardTitle>
              <PieChart className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${commission.avgPerAppointment.toFixed(2)}</div>
              <Muted className="text-xs">{commission.totalAppointments} appointments this month</Muted>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <EarningsChart data={dailyEarnings} />
          <ServiceBreakdown data={serviceBreakdown} />
        </div>

        {/* Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle>Commission Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <Stack gap="md">
              <P className="text-muted-foreground">
                Your commission is calculated based on completed appointments. The figures shown represent the total service revenue from appointments you&apos;ve completed.
              </P>
              <div className="pt-4 border-t">
                <P className="text-sm font-medium">This Month&apos;s Performance</P>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <Muted className="text-sm">Completed Appointments</Muted>
                    <P className="text-lg font-semibold">{commission.totalAppointments}</P>
                  </div>
                  <div>
                    <Muted className="text-sm">Total Revenue</Muted>
                    <P className="text-lg font-semibold">${commission.monthEarnings.toFixed(2)}</P>
                  </div>
                </div>
              </div>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Section>
  )
}
