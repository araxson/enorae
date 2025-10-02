import { getDashboardMetrics, getRecentAppointments, getUserSalon } from './dal/dashboard.queries'
import { MetricsCards } from './components/metrics-cards'
import { RecentBookings } from './components/recent-bookings'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Section, Stack, Box, Group } from '@/components/layout'
import { H1, Lead } from '@/components/ui/typography'
import { BarChart3, Calendar, TrendingUp } from 'lucide-react'

export async function BusinessDashboard() {
  let salon
  try {
    salon = await getUserSalon()
  } catch (error) {
    return (
      <Section size="lg">
        <H1>Please log in to view dashboard</H1>
      </Section>
    )
  }

  if (!salon || !salon.id) {
    return (
      <Section size="lg">
        <H1>No salon found</H1>
        <Lead>Please create a salon to access the dashboard</Lead>
      </Section>
    )
  }

  const metrics = await getDashboardMetrics(salon.id)
  const recentAppointments = await getRecentAppointments(salon.id)

  return (
    <Section size="lg">
      <Stack gap="xl">
        <Box>
          <H1>{salon.name || 'Business'} Dashboard</H1>
          <Lead>Manage your salon business</Lead>
        </Box>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="overview">
              <Group gap="xs">
                <BarChart3 className="h-4 w-4" />
                Overview
              </Group>
            </TabsTrigger>
            <TabsTrigger value="appointments">
              <Group gap="xs">
                <Calendar className="h-4 w-4" />
                Appointments
              </Group>
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <Group gap="xs">
                <TrendingUp className="h-4 w-4" />
                Analytics
              </Group>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Stack gap="lg">
              <MetricsCards metrics={metrics} />
              <RecentBookings appointments={recentAppointments} />
            </Stack>
          </TabsContent>

          <TabsContent value="appointments">
            <RecentBookings appointments={recentAppointments} />
          </TabsContent>

          <TabsContent value="analytics">
            <MetricsCards metrics={metrics} />
          </TabsContent>
        </Tabs>
      </Stack>
    </Section>
  )
}
